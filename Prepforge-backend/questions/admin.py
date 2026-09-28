from django.contrib import admin
from .models import Question, QuestionProgress, StudySession

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("title", "difficulty", "topic", "owner", "created_at")
    list_filter = ("difficulty", "topic")
    search_fields = ("title", "description", "topic")


@admin.register(QuestionProgress)
class QuestionProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "question", "status", "solved_at")
    list_filter = ("status",)


@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display = ("user", "started_at", "ended_at")
    list_filter = ("user",)
