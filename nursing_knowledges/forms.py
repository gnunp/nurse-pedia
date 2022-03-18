from django import forms
from django.forms import ModelForm
from .models import DiagnosisSmallCategory, DiseaseSmallCategory

class DiseaseSmallForm(ModelForm):
    class Meta:
        model = DiseaseSmallCategory
        fields = (
            "definition",
            "cause",
            "symptom",
            "diagnosis_and_checkup",
            "treatment",
            "nursing",
        )
        widgets = {
            'definition': forms.Textarea(attrs={'placeholder': '정의', 'class': 'edit_textareas'}),
            'cause': forms.Textarea(attrs={'placeholder': '원인', 'class': 'edit_textareas'}),
            'symptom': forms.Textarea(attrs={'placeholder': '증상', 'class': 'edit_textareas'}),
            'diagnosis_and_checkup': forms.Textarea(attrs={'placeholder': '진단/검사', 'class': 'edit_textareas'}),
            'treatment': forms.Textarea(attrs={'placeholder': '치료', 'class': 'edit_textareas'}),
            'nursing': forms.Textarea(attrs={'placeholder': '간호', 'class': 'edit_textareas'}),
        }

class DiagnosisForm(ModelForm):
    class Meta:
        model = DiagnosisSmallCategory
        fields = (
            "definition",
            "intervention_content",
        )
        widgets = {
            'definition': forms.Textarea(attrs={'placeholder': '정의', 'class': 'edit_textareas'}),
            'intervention_content': forms.Textarea(attrs={'placeholder': '관련 대표 중재', 'class': 'edit_textareas'}),
        }