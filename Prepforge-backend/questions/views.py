from datetime import timedelta

from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.db.models import Count
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.core.paginator import Paginator

from .forms import QuestionForm, QuestionProgressForm
from .models import Question, QuestionProgress, StudySession


def home(request):
    return render(request, "questions/home.html")


def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("login")
    else:
        form = UserCreationForm()

    return render(request, "questions/register.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)

        if form.is_valid():
            user = form.get_user()
            login(request, user)

            next_url = request.POST.get("next") or request.GET.get("next")
            if next_url:
                return redirect(next_url)

            return redirect("dashboard")
    else:
        form = AuthenticationForm()

    return render(
        request,
        "questions/login.html",
        {"form": form, "next": request.GET.get("next", "")},
    )


def logout_view(request):
    logout(request)
    return redirect("login")


@login_required
def dashboard(request):
    questions = Question.objects.filter(owner=request.user)

    total_questions = questions.count()

    solved_questions = QuestionProgress.objects.filter(
        user=request.user,
        status="Solved",
    ).count()

    remaining_questions = max(total_questions - solved_questions, 0)

    progress_percentage = (
        round((solved_questions / total_questions) * 100)
        if total_questions
        else 0
    )

    difficulty_counts = (
        questions.values("difficulty")
        .annotate(count=Count("id"))
        .order_by("difficulty")
    )

    topic_counts = (
        questions.values("topic")
        .annotate(count=Count("id"))
        .order_by("-count", "topic")
    )

    recent_questions = questions.order_by("-created_at", "-id")[:5]

    completed_sessions = StudySession.objects.filter(
        user=request.user,
        ended_at__isnull=False,
    )

    total_study_time = timedelta()
    today_study_time = timedelta()

    today = timezone.localdate()

    for session in completed_sessions:
        duration = session.duration()

        if duration:
            total_study_time += duration

            if timezone.localtime(session.started_at).date() == today:
                today_study_time += duration

    active_session = (
        StudySession.objects.filter(
            user=request.user,
            ended_at__isnull=True,
        )
        .order_by("-started_at")
        .first()
    )

    recent_sessions = StudySession.objects.filter(
        user=request.user
    ).order_by("-started_at")[:5]

    study_days = set()

    for session in completed_sessions:
        study_days.add(timezone.localtime(session.started_at).date())

    streak = 0
    current_day = today

    while current_day in study_days:
        streak += 1
        current_day -= timedelta(days=1)

    context = {
        "total_questions": total_questions,
        "solved_questions": solved_questions,
        "remaining_questions": remaining_questions,
        "progress_percentage": progress_percentage,
        "difficulty_counts": difficulty_counts,
        "topic_counts": topic_counts,
        "recent_questions": recent_questions,
        "total_study_time": total_study_time,
        "today_study_time": today_study_time,
        "active_session": active_session,
        "recent_sessions": recent_sessions,
        "study_streak": streak,
    }

    return render(request, "questions/dashboard.html", context)


@login_required
def question_list(request):
    questions = Question.objects.filter(owner=request.user)

    search_query = request.GET.get("search", "").strip()
    difficulty = request.GET.get("difficulty", "").strip()
    topic = request.GET.get("topic", "").strip()
    status = request.GET.get("status", "").strip()

    if search_query:
        questions = questions.filter(title__icontains=search_query)

    if difficulty:
        questions = questions.filter(difficulty=difficulty)

    if topic:
        questions = questions.filter(topic=topic)

    if status in ["Not Started", "In Progress", "Solved"]:
        matching_question_ids = QuestionProgress.objects.filter(
            user=request.user,
            status=status,
        ).values_list("question_id", flat=True)

        if status == "Not Started":
            # Questions without a progress row are also Not Started.
            questions = questions.exclude(
                id__in=QuestionProgress.objects.filter(
                    user=request.user
                ).exclude(status="Not Started").values_list(
                    "question_id", flat=True
                )
            )
        else:
            questions = questions.filter(id__in=matching_question_ids)

    questions = questions.order_by("-created_at", "-id")

    topics = (
        Question.objects.filter(owner=request.user)
        .values_list("topic", flat=True)
        .distinct()
        .order_by("topic")
    )

    paginator = Paginator(questions, 5)
    page_obj = paginator.get_page(request.GET.get("page"))

    context = {
        "questions": page_obj,
        "search_query": search_query,
        "selected_difficulty": difficulty,
        "selected_topic": topic,
        "selected_status": status,
        "topics": topics,
    }

    return render(request, "questions/question_list.html", context)


@login_required
def add_question(request):
    if request.method == "POST":
        form = QuestionForm(request.POST)

        if form.is_valid():
            question = form.save(commit=False)
            question.owner = request.user
            question.save()
            return redirect("question_list")
    else:
        form = QuestionForm()

    return render(request, "questions/add_question.html", {"form": form})


@login_required
def question_detail(request, question_id):
    question = get_object_or_404(
        Question,
        id=question_id,
        owner=request.user,
    )

    progress = QuestionProgress.objects.filter(
        user=request.user,
        question=question,
    ).first()

    return render(
        request,
        "questions/question_detail.html",
        {"question": question, "progress": progress},
    )


@login_required
def edit_question(request, question_id):
    question = get_object_or_404(
        Question,
        id=question_id,
        owner=request.user,
    )

    if request.method == "POST":
        form = QuestionForm(request.POST, instance=question)

        if form.is_valid():
            form.save()
            return redirect(
                "question_detail",
                question_id=question.id,
            )
    else:
        form = QuestionForm(instance=question)

    return render(request, "questions/edit_question.html", {"form": form, "question": question})


@login_required
def delete_question(request, question_id):
    question = get_object_or_404(
        Question,
        id=question_id,
        owner=request.user,
    )

    if request.method == "POST":
        question.delete()
        return redirect("question_list")

    return render(
        request,
        "questions/delete_question.html",
        {"question": question},
    )


@login_required
def mark_question_solved(request, question_id):
    if request.method != "POST":
        return redirect("question_detail", question_id=question_id)

    question = get_object_or_404(
        Question,
        id=question_id,
        owner=request.user,
    )

    progress, _ = QuestionProgress.objects.get_or_create(
        user=request.user,
        question=question,
    )

    progress.status = "Solved"
    progress.solved_at = timezone.now()
    progress.save()

    return redirect("question_detail", question_id=question.id)


@login_required
def update_question_progress(request, question_id):
    question = get_object_or_404(
        Question,
        id=question_id,
        owner=request.user,
    )

    progress, _ = QuestionProgress.objects.get_or_create(
        user=request.user,
        question=question,
    )

    if request.method == "POST":
        form = QuestionProgressForm(request.POST, instance=progress)

        if form.is_valid():
            progress = form.save(commit=False)

            if progress.status == "Solved":
                progress.solved_at = timezone.now()
            else:
                progress.solved_at = None

            progress.save()

            return redirect("question_detail", question_id=question.id)
    else:
        form = QuestionProgressForm(instance=progress)

    return render(
        request,
        "questions/update_progress.html",
        {"form": form, "question": question},
    )


@login_required
def start_study_session(request):
    if request.method == "POST":
        active_session = StudySession.objects.filter(
            user=request.user,
            ended_at__isnull=True,
        ).first()

        if not active_session:
            StudySession.objects.create(user=request.user)

    return redirect("dashboard")


@login_required
def end_study_session(request):
    if request.method == "POST":
        active_session = StudySession.objects.filter(
            user=request.user,
            ended_at__isnull=True,
        ).order_by("-started_at").first()

        if active_session:
            active_session.ended_at = timezone.now()
            active_session.save()

    return redirect("dashboard")
