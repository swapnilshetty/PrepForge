from django.utils import timezone

from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError

from .models import Category, Topic, LearningContent, LessonProgress
from .serializers import (
    CategorySerializer,
    TopicSerializer,
    LearningContentSerializer,
    LessonProgressSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.using("content").all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class CategoryDetailView(generics.RetrieveAPIView):
    queryset = Category.objects.using("content").all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class TopicListView(generics.ListAPIView):
    queryset = Topic.objects.using("content").all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.AllowAny]


class TopicDetailView(generics.RetrieveAPIView):
    queryset = Topic.objects.using("content").all()
    serializer_class = TopicSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


class LearningContentListView(generics.ListAPIView):
    serializer_class = LearningContentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = LearningContent.objects.using("content").all()

        topic = self.request.query_params.get("topic")

        if topic:
            topic_ids = Topic.objects.using("content").filter(
                slug=topic
            ).values_list("id", flat=True)

            queryset = queryset.filter(
                topic_id__in=topic_ids
            )

        return queryset.order_by("order", "id")


class LearningContentDetailView(generics.RetrieveAPIView):
    queryset = LearningContent.objects.using("content").all()
    serializer_class = LearningContentSerializer
    permission_classes = [permissions.AllowAny]


class LessonProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LessonProgress.objects.filter(
            user=self.request.user
        ).order_by("-completed_at")

    def perform_create(self, serializer):
        content_id = serializer.validated_data["content_id"]
        completed = serializer.validated_data.get(
            "completed",
            False
        )

        # Verify that the lesson exists in the MySQL content database.
        exists = LearningContent.objects.using("content").filter(
            id=content_id
        ).exists()

        if not exists:
            raise ValidationError(
                {
                    "content": "Learning content does not exist."
                }
            )

        # Save only the lesson ID in SQLite.
        LessonProgress.objects.update_or_create(
            user=self.request.user,
            content_id=content_id,
            defaults={
                "completed": completed,
                "completed_at": (
                    timezone.now()
                    if completed
                    else None
                ),
            },
        )