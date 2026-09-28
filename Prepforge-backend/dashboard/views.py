from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from questions.models import QuestionProgress
from learning.models import Category, LearningContent, LessonProgress
from coding.models import CodingProblem, CodingProgress, Submission
from interviews.models import InterviewQuestion, InterviewProgress


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # -------------------------
        # Learning
        # -------------------------

        total_categories = Category.objects.using("content").count()
        total_content = LearningContent.objects.using("content").count()

        lessons_completed = LessonProgress.objects.filter(
            user=user,
            completed=True
        ).count()

        # -------------------------
        # Coding
        # -------------------------

        total_problems = CodingProblem.objects.using("content").count()

        coding_solved = CodingProgress.objects.filter(
            user=user,
            status="Solved"
        ).count()

        coding_attempted = CodingProgress.objects.filter(
            user=user,
            status="Attempted"
        ).count()

        if total_problems > 0:
            coding_progress = (
                coding_solved / total_problems
            ) * 100
        else:
            coding_progress = 0

        # -------------------------
        # Interviews
        # -------------------------

        total_questions = InterviewQuestion.objects.using(
            "content"
        ).count()

        interviews_prepared = InterviewProgress.objects.filter(
            user=user,
            prepared=True
        ).count()

        if total_questions > 0:
            interview_progress = (
                interviews_prepared / total_questions
            ) * 100
        else:
            interview_progress = 0

        # -------------------------
        # Overall progress
        # -------------------------

        learning_progress = (
            lessons_completed / total_content * 100
            if total_content > 0
            else 0
        )

        overall_progress = (
            learning_progress
            + coding_progress
            + interview_progress
        ) / 3

        # -------------------------
        # Recent coding activity
        # -------------------------

        recent_progress = CodingProgress.objects.filter(
            user=user
        ).order_by("-solved_at", "-id")[:5]

        recent_coding_activity = []

        for item in recent_progress:
            problem = (
                CodingProblem.objects
                .using("content")
                .filter(id=item.problem_id)
                .first()
            )

            if problem:
                recent_coding_activity.append({
                    "id": item.id,
                    "problem_title": problem.title,
                    "difficulty": problem.difficulty,
                    "status": item.status,
                    "solved_at": (
                        item.solved_at.strftime("%Y-%m-%d")
                        if item.solved_at
                        else None
                    ),
                })

        # -------------------------
        # Response
        # -------------------------

        return Response({
            "user": {
                "username": user.username,
            },

            "learning": {
                "total_categories": total_categories,
                "total_content": total_content,
                "completed": lessons_completed,
                "progress_percentage": round(
                    learning_progress,
                    1
                ),
            },

            "coding": {
                "total_problems": total_problems,
                "solved": coding_solved,
                "attempted": coding_attempted,
                "progress_percentage": round(
                    coding_progress,
                    1
                ),
            },

            "interviews": {
                "total_questions": total_questions,
                "answered": interviews_prepared,
                "progress_percentage": round(
                    interview_progress,
                    1
                ),
            },

            "overall_progress": round(
                overall_progress,
                1
            ),

            "recent_coding_activity": recent_coding_activity,
        })


class ProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        questions_solved = QuestionProgress.objects.filter(
            user=user,
            status="Solved"
        ).count()

        lessons_completed = LessonProgress.objects.filter(
            user=user,
            completed=True
        ).count()

        coding_solved = CodingProgress.objects.filter(
            user=user,
            status="Solved"
        ).count()

        coding_attempted = CodingProgress.objects.filter(
            user=user,
            status="Attempted"
        ).count()

        interviews_prepared = InterviewProgress.objects.filter(
            user=user,
            prepared=True
        ).count()

        return Response({
            "questions_solved": questions_solved,
            "lessons_completed": lessons_completed,
            "coding_solved": coding_solved,
            "coding_attempted": coding_attempted,
            "interviews_prepared": interviews_prepared,
        })