from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from rest_framework import generics, serializers
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny

from accounts.serializers import RegisterSerializer
from accounts.password_serializers import (
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        request = self.context.get("request")

        user = authenticate(
            request=request,
            username=data["username"],
            password=data["password"],
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid username or password."
            )

        data["user"] = user
        return data


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        token, created = Token.objects.get_or_create(
            user=user
        )

        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        })


class PasswordResetRequestView(generics.GenericAPIView):
    serializer_class = PasswordResetRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        users = User.objects.filter(
            email__iexact=email,
            is_active=True,
        )

        for user in users:
            uid = urlsafe_base64_encode(
                force_bytes(user.pk)
            )

            token = default_token_generator.make_token(user)

            reset_url = (
                f"{settings.FRONTEND_URL}"
                f"/reset-password/{uid}/{token}/"
            )

            send_mail(
                subject="Reset your PrepForge password",
                message=(
                    f"Hello {user.username},\n\n"
                    f"We received a request to reset your "
                    f"PrepForge password.\n\n"
                    f"Reset your password using this link:\n\n"
                    f"{reset_url}\n\n"
                    f"If you did not request this, you can "
                    f"safely ignore this email.\n\n"
                    f"This link can only be used once.\n\n"
                    f"PrepForge"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )

        # Always return the same response.
        # This prevents account/email enumeration.
        return Response({
            "detail": (
                "If an account exists with that email, "
                "a password reset link has been sent."
            )
        })


class PasswordResetConfirmView(generics.GenericAPIView):
    serializer_class = PasswordResetConfirmSerializer
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user_id = urlsafe_base64_decode(
                uidb64
            ).decode()

            user = User.objects.get(
                pk=user_id
            )

        except (
            TypeError,
            ValueError,
            OverflowError,
            User.DoesNotExist,
        ):
            return Response(
                {
                    "detail": "Invalid or expired reset link."
                },
                status=400,
            )

        if not default_token_generator.check_token(
            user,
            token
        ):
            return Response(
                {
                    "detail": "Invalid or expired reset link."
                },
                status=400,
            )

        user.set_password(
            serializer.validated_data["new_password"]
        )

        user.save(
            update_fields=["password"]
        )

        # Invalidate existing authentication tokens.
        Token.objects.filter(
            user=user
        ).delete()

        return Response({
            "detail": (
                "Password reset successful. "
                "You can now log in with your new password."
            )
        })