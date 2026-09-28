from django.urls import path

from .views import (
    InterviewQuestionListView,
    InterviewQuestionDetailView,
    BookmarkListCreateView,
    BookmarkDeleteView,
    UserAnswerListCreateView,
    UserAnswerDetailView,
    InterviewProgressListCreateView,
)


urlpatterns = [
    path(
        "questions/",
        InterviewQuestionListView.as_view(),
        name="interview-question-list",
    ),

    path(
        "questions/<int:pk>/",
        InterviewQuestionDetailView.as_view(),
        name="interview-question-detail",
    ),

    # Bookmarks

    path(
        "bookmarks/",
        BookmarkListCreateView.as_view(),
        name="bookmark-list-create",
    ),

    path(
        "bookmarks/<int:pk>/",
        BookmarkDeleteView.as_view(),
        name="bookmark-delete",
    ),

    # User answers

    path(
        "answers/",
        UserAnswerListCreateView.as_view(),
        name="answer-list-create",
    ),

    path(
        "answers/<int:pk>/",
        UserAnswerDetailView.as_view(),
        name="answer-detail",
    ),

    # Interview progress

    path(
        "progress/",
        InterviewProgressListCreateView.as_view(),
        name="interview-progress",
    ),
]