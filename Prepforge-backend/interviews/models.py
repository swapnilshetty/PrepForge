from django.contrib.auth.models import User
from django.db import models


class InterviewQuestion(models.Model):
    TYPE_CHOICES = [
        ("Technical", "Technical"),
        ("Behavioral", "Behavioral"),
        ("System Design", "System Design"),
    ]

    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    title = models.CharField(
        max_length=300,
    )

    question_type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
    )

    # Topic is stored in the MySQL content database.
    topic_id = models.IntegerField(
        null=True,
        blank=True,
    )

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
    )

    answer = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.title


class Bookmark(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    # InterviewQuestion is stored in MySQL.
    interview_question_id = models.IntegerField(
        null=True,
        blank=True,
    )

    # CodingProblem is stored in MySQL.
    coding_problem_id = models.IntegerField(
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "interview_question_id",
                ],
                name="unique_interview_bookmark",
            ),
        ]

    def __str__(self):
        return f"{self.user.username} bookmark"


class UserAnswer(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    # InterviewQuestion is stored in MySQL.
    question_id = models.IntegerField(
        null=True,
    )

    answer = models.TextField()

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "question_id",
                ],
                name="unique_user_interview_answer",
            ),
        ]

    def __str__(self):
        return f"{self.user.username} - Question {self.question_id}"


class InterviewProgress(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="interview_progress",
    )

    # InterviewQuestion is stored in MySQL.
    question_id = models.IntegerField(
        null=True,
    )

    prepared = models.BooleanField(
        default=False,
    )

    prepared_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "question_id",
                ],
                name="unique_user_interview_progress",
            ),
        ]

    def __str__(self):
        return f"{self.user.username} - Question {self.question_id}"