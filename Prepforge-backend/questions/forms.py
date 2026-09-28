from django import forms
from .models import Question, QuestionProgress


class QuestionForm(forms.ModelForm):
    def clean_title(self):
        title = self.cleaned_data["title"].strip()

        if len(title) < 5:
            raise forms.ValidationError(
                "Title must contain at least 5 characters."
            )

        return title

    def clean_topic(self):
        return self.cleaned_data["topic"].strip()

    class Meta:
        model = Question
        fields = ["title", "description", "difficulty", "topic"]
        widgets = {
            "title": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "e.g. Two Sum"}
            ),
            "description": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 5,
                    "placeholder": "Describe the problem...",
                }
            ),
            "difficulty": forms.Select(attrs={"class": "form-select"}),
            "topic": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "e.g. Arrays"}
            ),
        }


class QuestionProgressForm(forms.ModelForm):
    class Meta:
        model = QuestionProgress
        fields = ["status"]
        widgets = {
            "status": forms.Select(attrs={"class": "form-select"}),
        }
