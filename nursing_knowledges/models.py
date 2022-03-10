from django.db import models
from django.urls import reverse

class DiseaseLargeCategory(models.Model):
    """
    질병 대분류 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 대분류명


    def __str__(self):
        return self.name


class DiseaseMediumCategory(models.Model):
    """
    질병 중분류 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 중분류명
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
    definition = models.TextField(max_length=3000, default="", blank=True)  # 정의 필드
    cause = models.TextField(max_length=3000, default="", blank=True)  # 원인 필드
    symptom = models.TextField(max_length=3000, default="", blank=True)  # 증상 필드
    diagnosis_and_checkup = models.TextField(max_length=3000, default="", blank=True)  # 진단/검사 필드
    treatment = models.TextField(max_length=3000, default="", blank=True)  # 치료 필드
    nursing = models.TextField(max_length=3000, default="", blank=True)  # 간호 필드
    disease_medium_category = models.ForeignKey(
        "DiseaseMediumCategory",
        on_delete=models.CASCADE,
        related_name="disease_small_categories",
    )  # 연결된 질병 중분류

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('nursing_knowledges:disease_detail', args=[self.id])

class DiagnosisLargeCategory(models.Model):
    """
    간호 진단 대분류 Model
    """
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class DiagnosisMediumCategory(models.Model):
    """
    간호 진단 중분류 Model
    """
    name = models.CharField(max_length=100, unique=True)
    diagnosis_large_category = models.ForeignKey(
        "DiagnosisLargeCategory",
        on_delete=models.CASCADE,
        related_name="diagnosis_medium_categories",
    )  # 연결된 진단 대분류

    def __str__(self):
        return self.name

class DiagnosisSmallCategory(models.Model):
    """
    간호 진단 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 진단명
    definition = models.TextField(max_length=3000, default="", blank=True)  # 진단의 정의
    intervention_content = models.TextField(max_length=3000, default="", blank=True)  # 진단이 가지는 중재들을 설명하는 필드
    related_diagnoses = models.ManyToManyField("self", symmetrical=False, blank=True, through="DiagnosisRelatedDiagnoses")  # 관련 간호진단
    diagnosis_medium_category = models.ForeignKey(
        "DiagnosisMediumCategory",
        on_delete=models.CASCADE,
        related_name="diagnosis_medium_categories",
        null=True,
        blank=True
    )  # 연결된 진단 중분류, null,blank=True는 추후 삭제될 예정

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('nursing_knowledges:diagnosis_detail', args=[self.id])

    def get_intervention_list(self):
        return self.intervention_content.split("\n") if True else ""

class DiagnosisRelatedDiagnoses(models.Model):
    """
    간호 진단 Model의 related_diagnoses의 through에 설정된 Model
    """
    from_diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, related_name="from_diagnosis")
    to_diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, related_name="to_diagnosis")
    like_users = models.ManyToManyField("users.User", related_name="like_related_diagnoses", blank=True)

    def __str__(self):
        return f"[{self.from_diagnosis.name}] -> [{self.to_diagnosis}]"
    

class DiagnosisInterventionAlpha(models.Model):
    """
    간호 진단의 중재 내용에,
    어떤 질병인지에 따라 추가로 들어가는 중재 내용 Model
    """
    diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, related_name="alphas")
    disease_medium_category = models.ForeignKey("DiseaseMediumCategory", on_delete=models.CASCADE, null=True, blank=True)  # 질병 중분류
    disease_small_category = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE, null=True, blank=True)  # 질병 소분류
    content = models.TextField(max_length=3000)



class DiagnosisToOther(models.Model):
    """
    노드의 연결관계를 나타내는 Model
    질병(중분류 or 소분류) <--> 진단
    """
    disease_medium_category = models.ForeignKey("DiseaseMediumCategory", on_delete=models.CASCADE, null=True, blank=True)  # 질병 중분류
    disease_small_category = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE, null=True, blank=True)  # 질병 소분류
    diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, null=True, blank=True)  # 진단

    def __str__(self):
        nodes = []
        if self.disease_small_category:
            nodes.append(f"[{self.disease_small_category.__class__.__name__}]{self.disease_small_category}")
        if self.disease_medium_category:
            nodes.append(f"[{self.disease_medium_category.__class__.__name__}]{self.disease_medium_category}")
        if self.diagnosis:
            nodes.append(f"[{self.diagnosis.__class__.__name__}]{self.diagnosis}")
        
        return f"{nodes.pop()} <--> {nodes.pop()}"

class KnowledgeEditHistory(models.Model):
    """
    질병, 진단을 수정한 사람의 정보와, 시간대가 나와있는 모델
    """
    disease = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE, null=True, blank=True)
    diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, null=True, blank=True)
    editor = models.ForeignKey("users.User", on_delete=models.CASCADE)
    changed_word_count = models.IntegerField(default=0)
    created_at = models.DateTimeField()

    def get_knowledge(self):
        if self.disease:
            return self.disease
        else:
            return self.diagnosis
    def get_change_word_count(self):
        if self.changed_word_count > 0:
            return f"+{self.changed_word_count}"
        else:
            return self.changed_word_count

    def edit_history(self):
        return f"{self.created_at.astimezone().strftime('%Y-%m-%d %H:%M:%S')} - {self.get_knowledge().name}[{self.get_change_word_count()}] - {self.editor.username}"

    def __str__(self):
        return self.edit_history()