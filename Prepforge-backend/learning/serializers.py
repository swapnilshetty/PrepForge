from rest_framework import serializers
from .models import Category, Topic, LearningContent, LessonProgress


class LearningContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearningContent
        fields = [
            "id",
            "topic",
            "title",
            "slug",
            "content",
            "order",
        ]


class LessonProgressSerializer(serializers.ModelSerializer):
    content = serializers.IntegerField(source="content_id")

    class Meta:
        model = LessonProgress
        fields = [
            "id",
            "content",
            "completed",
            "completed_at",
        ]


class TopicSerializer(serializers.ModelSerializer):
    contents = LearningContentSerializer(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "contents",
        ]


class CategorySerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    topics_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "icon",
            "topics",
            "topics_count",
        ]

    def get_topics_count(self, obj):
        return obj.topics.count()