from django.contrib import admin
from django.urls import path, include

from questions.views import (
    home,
    question_list,
    add_question,
    question_detail,
    edit_question,
    delete_question,
    register,
    login_view,
    logout_view,
    dashboard,
    mark_question_solved,
    update_question_progress,
    start_study_session,
    end_study_session,
)

urlpatterns = [
    path("admin/", admin.site.urls),

    path("", home, name="home"),

    path("dashboard/", dashboard, name="dashboard"),

    path("questions/", question_list, name="question_list"),
    path("questions/add/", add_question, name="add_question"),
    path("questions/<int:question_id>/", question_detail, name="question_detail"),
    path("questions/<int:question_id>/edit/", edit_question, name="edit_question"),
    path("questions/<int:question_id>/delete/", delete_question, name="delete_question"),

    path(
        "questions/<int:question_id>/solve/",
        mark_question_solved,
        name="mark_question_solved",
    ),
    path(
        "questions/<int:question_id>/progress/",
        update_question_progress,
        name="update_question_progress",
    ),

    path("study/start/", start_study_session, name="start_study_session"),
    path("study/end/", end_study_session, name="end_study_session"),

    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("api/learning/", include("learning.urls")),
    path("api/coding/", include("coding.urls")),
    path("api/interviews/",include("interviews.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/auth/", include("accounts.urls")),
]
