from django.urls import path
from .views import (
    CategoryListView,
    CategoryDetailView,
    TopicListView,
    TopicDetailView,
    LearningContentListView,
    LearningContentDetailView,
    LessonProgressListCreateView,
)


urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path(
        "categories/<slug:slug>/",
        CategoryDetailView.as_view(),
        name="category-detail",
    ),

    path("topics/", TopicListView.as_view(), name="topic-list"),
    path(
        "topics/<slug:slug>/",
        TopicDetailView.as_view(),
        name="topic-detail",
    ),

    path("content/", LearningContentListView.as_view(), name="content-list"),
    path(
        "content/<int:pk>/",
        LearningContentDetailView.as_view(),
        name="content-detail",
    ),
    path("progress/",LessonProgressListCreateView.as_view(),name="lesson-progress",),
]