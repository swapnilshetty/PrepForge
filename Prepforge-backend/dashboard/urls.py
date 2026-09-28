from django.urls import path
from .views import DashboardView, ProgressView


urlpatterns = [
    path("", DashboardView.as_view(), name="dashboard"),
    path("progress/", ProgressView.as_view(), name="progress"),
]