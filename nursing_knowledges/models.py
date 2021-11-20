from django.db import models

class DiseaseLargeCategory(models.Model):
    """
    질병 대분류 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 대분류명
    content = models.TextField(max_length=3000, default="", blank=True)  # 질병의 대분류를 설명하는 필드


    def __str__(self):
        return self.name


class DiseaseMediumCategory(models.Model):
    """
    질병 중분류 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 중분류명
    content = models.TextField(max_length=3000, default="", blank=True)  # 질병의 중분류를 설명하는 필드
    disease_large_category = models.ForeignKey(
        "DiseaseLargeCategory",
        on_delete=models.CASCADE,
        related_name="disease_medium_categories",
    )  # 연결된 질병 대분류

    def __str__(self):
        return self.name

class DiseaseSmallCategory(models.Model):
    """
    질병 소분류 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 질병명
    content = models.TextField(max_length=3000, default="", blank=True)  # 질병의 정의/원인/치료를 설명하는 필드
    disease_medium_category = models.ForeignKey(
        "DiseaseMediumCategory",
        on_delete=models.CASCADE,
        related_name="disease_small_categories",
    )  # 연결된 질병 중분류


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

class Connection(models.Model):
    """
    노드의 연결관계를 나타내는 Model
    질병(중분류 or 소분류) <--> 진단
    """
    disease_medium_category = models.ForeignKey("DiseaseMediumCategory", on_delete=models.CASCADE, null=True, blank=True)  # 질병 중분류
    disease_small_category = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE, null=True, blank=True)  # 질병 소분류
    diagnosis = models.ForeignKey("Diagnosis", on_delete=models.CASCADE, null=True, blank=True)  # 진단

    def __str__(self):
        nodes = []
        if self.diagnosis:
            nodes.append(f"[{self.diagnosis.__class__.__name__}]{self.diagnosis}")
        if self.disease_small_category:
            nodes.append(f"[{self.disease_small_category.__class__.__name__}]{self.disease_small_category}")
        if self.disease_medium_category:
            nodes.append(f"[{self.disease_medium_category.__class__.__name__}]{self.disease_medium_category}")
        
        return f"{nodes.pop()} <--> {nodes.pop()}"
