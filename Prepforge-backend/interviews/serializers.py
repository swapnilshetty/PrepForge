from rest_framework import serializers
from .models import (
    InterviewQuestion,
    Bookmark,
    UserAnswer,
    InterviewProgress,
)
from learning.models import Topic


class InterviewQuestionSerializer(serializers.ModelSerializer):
    topic_name = serializers.SerializerMethodField()

    class Meta:
        model = InterviewQuestion
        fields = [
            "id",
            "title",
            "question_type",
            "topic_id",
            "topic_name",
            "difficulty",
            "answer",
            "created_at",
        ]

    def get_topic_name(self, obj):
        if not obj.topic_id:
            return None

        topic = (
            Topic.objects
            .using("content")
            .filter(id=obj.topic_id)
            .first()
        )

        return topic.name if topic else None


class InterviewQuestionListSerializer(serializers.ModelSerializer):
    topic_name = serializers.SerializerMethodField()

    class Meta:
        model = InterviewQuestion
        fields = [
            "id",
            "title",
            "question_type",
            "topic_id",
            "topic_name",
            "difficulty",
        ]

    def get_topic_name(self, obj):
        if not obj.topic_id:
            return None

        topic = (
            Topic.objects
            .using("content")
            .filter(id=obj.topic_id)
            .first()
        )

        return topic.name if topic else None


class BookmarkSerializer(serializers.ModelSerializer):
    interview_question = serializers.IntegerField(
        source="interview_question_id",
        required=False,
        allow_null=True
    )

    coding_problem = serializers.IntegerField(
        source="coding_problem_id",
        required=False,
        allow_null=True
    )

    class Meta:
        model = Bookmark
        fields = [
            "id",
            "interview_question",
            "coding_problem",
            "created_at",
        ]


class UserAnswerSerializer(serializers.ModelSerializer):
    question = serializers.IntegerField(
        source="question_id"
    )
    question_title = serializers.SerializerMethodField()

    class Meta:
        model = UserAnswer
        fields = [
            "id",
            "question",
            "question_title",
            "answer",
            "updated_at",
        ]

    def get_question_title(self, obj):
        question = (
            InterviewQuestion.objects
            .using("content")
            .filter(id=obj.question_id)
            .first()
        )

        return question.title if question else None


class InterviewProgressSerializer(serializers.ModelSerializer):
    question = serializers.IntegerField(
        source="question_id"
    )
    question_title = serializers.SerializerMethodField()

    class Meta:
        model = InterviewProgress
        fields = [
            "id",
            "question",
            "question_title",
            "prepared",
            "prepared_at",
        ]

    def get_question_title(self, obj):
        question = (
            InterviewQuestion.objects
            .using("content")
            .filter(id=obj.question_id)
            .first()
        )

        return question.title if question else None