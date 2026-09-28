from django.contrib.auth.models import User
from django.db import models


class CodingProblem(models.Model):
    DIFFICULTY_CHOICES = [
        ("Easy", "Easy"),
        ("Medium", "Medium"),
        ("Hard", "Hard"),
    ]

    title = models.CharField(max_length=200)

    slug = models.SlugField(
        unique=True,
    )

    # Topic is stored in the MySQL content database.
    topic_id = models.IntegerField(
        null=True,
    )

    description = models.TextField()

    input_format = models.TextField(
        blank=True,
    )

    output_format = models.TextField(
        blank=True,
    )

    constraints = models.TextField(
        blank=True,
    )

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
    )

    starter_code = models.TextField(
        blank=True,
    )

    solution_explanation = models.TextField(
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return self.title


class TestCase(models.Model):
    # CodingProblem is stored in MySQL.
    problem_id = models.IntegerField(
        null=True,
    )

    input_data = models.TextField()

    expected_output = models.TextField()

    is_hidden = models.BooleanField(
        default=True,
    )

    def __str__(self):
        return f"Test Case {self.id}"


class Submission(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Wrong Answer", "Wrong Answer"),
        ("Runtime Error", "Runtime Error"),
        ("Time Limit Exceeded", "Time Limit Exceeded"),
        ("Compilation Error", "Compilation Error"),
    ]

    LANGUAGE_CHOICES = [
        ("python", "Python"),
        ("java", "Java"),
        ("javascript", "JavaScript"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="coding_submissions",
    )

    # CodingProblem is stored in MySQL.
    problem_id = models.IntegerField(
        null=True,
    )

    language = models.CharField(
        max_length=30,
        choices=LANGUAGE_CHOICES,
    )

    source_code = models.TextField()

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="Pending",
    )

    runtime = models.FloatField(
        null=True,
        blank=True,
    )

    memory = models.FloatField(
        null=True,
        blank=True,
    )

    submitted_at = models.DateTimeField(
        auto_now_add=True,
    )

    def __str__(self):
        return f"{self.user.username} - Problem {self.problem_id}"


class CodingProgress(models.Model):
    STATUS_CHOICES = [
        ("Not Started", "Not Started"),
        ("Attempted", "Attempted"),
        ("Solved", "Solved"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    # CodingProblem is stored in MySQL.
    problem_id = models.IntegerField(
        null=True,
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Not Started",
    )

    attempts = models.PositiveIntegerField(
        default=0,
    )

    solved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "problem_id"],
                name="unique_user_coding_problem",
            ),
        ]

    def __str__(self):
        return f"{self.user.username} - Problem {self.problem_id}"