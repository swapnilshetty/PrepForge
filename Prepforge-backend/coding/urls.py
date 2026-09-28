from django.urls import path
from .views import (
    CodingProblemListView,
    CodingProblemDetailView,
    SubmissionListView,
    CodingProgressListView,
    SubmissionCreateView,
    CodeExecutionView,
)


urlpatterns = [
    path(
        "problems/",
        CodingProblemListView.as_view(),
        name="coding-problem-list",
    ),
    path(
        "problems/<slug:slug>/",
        CodingProblemDetailView.as_view(),
        name="coding-problem-detail",
    ),
    path(
        "submissions/",
        SubmissionListView.as_view(),
        name="submission-list",
    ),
    path(
        "progress/",
        CodingProgressListView.as_view(),
        name="coding-progress-list",
    ),
    path(
    "submissions/create/",
    SubmissionCreateView.as_view(),
    name="submission-create",
),
    path(
    "run/",
    CodeExecutionView.as_view(),
    name="code-run",
),
]