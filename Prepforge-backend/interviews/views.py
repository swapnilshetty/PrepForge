from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import (
    InterviewQuestion,
    Bookmark,
    UserAnswer,
    InterviewProgress,
)

from .serializers import (
    InterviewQuestionSerializer,
    InterviewQuestionListSerializer,
    BookmarkSerializer,
    UserAnswerSerializer,
    InterviewProgressSerializer,
)

from learning.models import Topic


class InterviewQuestionListView(generics.ListAPIView):
    serializer_class = InterviewQuestionListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = InterviewQuestion.objects.using("content").all()

        question_type = self.request.query_params.get("type")
        difficulty = self.request.query_params.get("difficulty")
        topic = self.request.query_params.get("topic")

        if question_type:
            queryset = queryset.filter(question_type=question_type)

        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        if topic:
            topic_ids = Topic.objects.using("content").filter(
                slug=topic
            ).values_list("id", flat=True)

            queryset = queryset.filter(topic_id__in=topic_ids)

        return queryset.order_by("-created_at")


class InterviewQuestionDetailView(generics.RetrieveAPIView):
    queryset = InterviewQuestion.objects.using("content").all()
    serializer_class = InterviewQuestionSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "pk"


class BookmarkListCreateView(generics.ListCreateAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(
            user=self.request.user
        ).order_by("-created_at")

    def perform_create(self, serializer):
        interview_question_id = serializer.validated_data.get(
            "interview_question_id"
        )

        coding_problem_id = serializer.validated_data.get(
            "coding_problem_id"
        )

        if interview_question_id:
            exists = InterviewQuestion.objects.using("content").filter(
                id=interview_question_id
            ).exists()

            if not exists:
                from rest_framework.exceptions import ValidationError
                raise ValidationError(
                    {"interview_question": "Question does not exist."}
                )

        serializer.save(user=self.request.user)


class BookmarkDeleteView(generics.DestroyAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(
            user=self.request.user
        )


class UserAnswerListCreateView(generics.ListCreateAPIView):
    serializer_class = UserAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAnswer.objects.filter(
            user=self.request.user
        ).order_by("-updated_at")

    def perform_create(self, serializer):
        question_id = serializer.validated_data["question_id"]

        exists = InterviewQuestion.objects.using("content").filter(
            id=question_id
        ).exists()

        if not exists:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                {"question": "Interview question does not exist."}
            )

        UserAnswer.objects.update_or_create(
            user=self.request.user,
            question_id=question_id,
            defaults={
                "answer": serializer.validated_data["answer"]
            }
        )


class UserAnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserAnswerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAnswer.objects.filter(
            user=self.request.user
        )


class InterviewProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = InterviewProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InterviewProgress.objects.filter(
            user=self.request.user
        ).order_by("-prepared_at")

    def perform_create(self, serializer):
        question_id = serializer.validated_data["question_id"]

        exists = InterviewQuestion.objects.using("content").filter(
            id=question_id
        ).exists()

        if not exists:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                {"question": "Interview question does not exist."}
            )

        InterviewProgress.objects.update_or_create(
            user=self.request.user,
            question_id=question_id,
            defaults={
                "prepared": serializer.validated_data.get(
                    "prepared",
                    False
                )
            }
        )