from django.db import models


class Disease(models.Model):
    """
    간호 질병 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 질병명
    content = models.TextField(max_length=3000, unique=True)  # 질병의 정의/원인/치료를 설명하는 필드

    def __str__(self):
        return self.name

class Diagnosis(models.Model):
    """
    간호 진단 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 진단명
    intervention_content = models.TextField(max_length=3000, default="")  # 진단이 가지는 중재들을 설명하는 필드

    class Meta:
        verbose_name = "Diagnose"

    def __str__(self):
        return self.name