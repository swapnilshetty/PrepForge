from rest_framework import serializers

from .models import (
    CodingProblem,
    TestCase,
    Submission,
    CodingProgress,
)


class CodingProblemListSerializer(serializers.ModelSerializer):
    topic_name = serializers.SerializerMethodField()

    class Meta:
        model = CodingProblem
        fields = [
            "id",
            "title",
            "slug",
            "topic_name",
            "difficulty",
        ]

    def get_topic_name(self, obj):
        from learning.models import Topic

        if not obj.topic_id:
            return None

        topic = Topic.objects.using("content").filter(
            id=obj.topic_id
        ).first()

        return topic.name if topic else None


class CodingProblemDetailSerializer(serializers.ModelSerializer):
    topic_name = serializers.SerializerMethodField()

    class Meta:
        model = CodingProblem
        fields = [
            "id",
            "title",
            "slug",
            "topic_name",
            "description",
            "input_format",
            "output_format",
            "constraints",
            "difficulty",
            "starter_code",
            "created_at",
        ]

    def get_topic_name(self, obj):
        from learning.models import Topic

        if not obj.topic_id:
            return None

        topic = Topic.objects.using("content").filter(
            id=obj.topic_id
        ).first()

        return topic.name if topic else None


class SubmissionSerializer(serializers.ModelSerializer):
    problem = serializers.IntegerField(
        source="problem_id"
    )

    problem_title = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = [
            "id",
            "problem",
            "problem_title",
            "language",
            "source_code",
            "status",
            "runtime",
            "memory",
            "submitted_at",
        ]

        read_only_fields = [
            "id",
            "problem_title",
            "status",
            "runtime",
            "memory",
            "submitted_at",
        ]

    def get_problem_title(self, obj):
        if not obj.problem_id:
            return None

        problem = CodingProblem.objects.using("content").filter(
            id=obj.problem_id
        ).first()

        return problem.title if problem else None


class CodingProgressSerializer(serializers.ModelSerializer):
    problem = serializers.IntegerField(
        source="problem_id"
    )

    problem_title = serializers.SerializerMethodField()

    class Meta:
        model = CodingProgress
        fields = [
            "id",
            "problem",
            "problem_title",
            "status",
            "attempts",
            "solved_at",
        ]

        read_only_fields = [
            "id",
            "problem_title",
            "attempts",
            "solved_at",
        ]

    def get_problem_title(self, obj):
        if not obj.problem_id:
            return None

        problem = CodingProblem.objects.using("content").filter(
            id=obj.problem_id
        ).first()

        return problem.title if problem else None