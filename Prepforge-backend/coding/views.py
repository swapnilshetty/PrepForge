from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .judge0_service import execute_code

from .models import (
    CodingProblem,
    Submission,
    CodingProgress,
)

from .serializers import (
    CodingProblemListSerializer,
    CodingProblemDetailSerializer,
    SubmissionSerializer,
    CodingProgressSerializer,
)


class CodingProblemListView(generics.ListAPIView):
    queryset = CodingProblem.objects.all()
    serializer_class = CodingProblemListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        difficulty = self.request.query_params.get("difficulty")
        topic = self.request.query_params.get("topic")

        if difficulty:
            queryset = queryset.filter(
                difficulty__iexact=difficulty
            )

        if topic:
            queryset = queryset.filter(
                topic_id__in=[
                    topic_obj.id
                    for topic_obj in self._get_topics(topic)
                ]
            )

        return queryset

    def _get_topics(self, topic_slug):
        from learning.models import Topic

        return Topic.objects.using("content").filter(
            slug=topic_slug
        )


class CodingProblemDetailView(generics.RetrieveAPIView):
    queryset = CodingProblem.objects.all()
    serializer_class = CodingProblemDetailSerializer
    lookup_field = "slug"


class SubmissionListView(generics.ListAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(
            user=self.request.user
        ).order_by("-submitted_at")


class SubmissionCreateView(generics.CreateAPIView):
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        problem_id = serializer.validated_data["problem_id"]

        problem_exists = CodingProblem.objects.using(
            "content"
        ).filter(
            id=problem_id
        ).exists()

        if not problem_exists:
            from rest_framework.exceptions import ValidationError

            raise ValidationError({
                "problem": "Coding problem does not exist."
            })

        serializer.save(
            user=self.request.user,
            status="Pending",
        )

        progress, created = CodingProgress.objects.get_or_create(
            user=self.request.user,
            problem_id=problem_id,
        )

        progress.attempts += 1
        progress.status = "Attempted"
        progress.save()


class CodingProgressListView(generics.ListAPIView):
    serializer_class = CodingProgressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CodingProgress.objects.filter(
            user=self.request.user
        ).order_by("-solved_at", "-id")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_problems = CodingProblem.objects.count()

        attempted_problems = queryset.filter(
            status__in=["Attempted", "Solved"]
        ).count()

        solved_problems = queryset.filter(
            status="Solved"
        ).count()

        total_attempts = sum(
            progress.attempts
            for progress in queryset
        )

        progress_percentage = (
            round(
                (solved_problems / total_problems) * 100
            )
            if total_problems
            else 0
        )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        return Response({
            "summary": {
                "total_problems": total_problems,
                "attempted_problems": attempted_problems,
                "solved_problems": solved_problems,
                "total_attempts": total_attempts,
                "progress_percentage": progress_percentage,
            },
            "problems": serializer.data,
        })

class CodeExecutionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        source_code = request.data.get("source_code", "")
        language = request.data.get("language", "python")
        stdin = request.data.get("stdin", "")

        # -------------------------------------------------
        # Validate source code
        # -------------------------------------------------

        if not source_code.strip():
            return Response(
                {"detail": "Source code cannot be empty."},
                status=400,
            )

        # -------------------------------------------------
        # Validate language
        # -------------------------------------------------

        allowed_languages = {
            "python",
            "java",
            "javascript",
        }

        if language not in allowed_languages:
            return Response(
                {"detail": "Unsupported language."},
                status=400,
            )

        # -------------------------------------------------
        # Execute code
        # -------------------------------------------------

        try:
            result = execute_code(
                source_code=source_code,
                language=language,
                stdin=stdin,
            )

        except Exception as error:
            print("Judge0 error:", error)

            return Response(
                {
                    "detail": "Unable to execute code.",
                },
                status=500,
            )

        # -------------------------------------------------
        # Return execution result
        # -------------------------------------------------

        status_info = result.get("status") or {}

        return Response(
            {
                "status": status_info.get(
                    "description",
                    "Unknown",
                ),
                "status_id": status_info.get("id"),

                "stdout": result.get("stdout") or "",
                "stderr": result.get("stderr") or "",

                "compile_output":
                    result.get("compile_output") or "",

                "message":
                    result.get("message") or "",

                "time":
                    result.get("time"),

                "memory":
                    result.get("memory"),
            }
        )