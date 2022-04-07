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


class BaseDiseaseSmallCategoryModel(models.Model):
    """
    질병 소분류 & 질병 소분류 History Model을 상속할 Abstract Model
    """
    definition = models.TextField(max_length=3000, default="", blank=True)  # 정의 필드
    cause = models.TextField(max_length=3000, default="", blank=True)  # 원인 필드
    symptom = models.TextField(max_length=3000, default="", blank=True)  # 증상 필드
    diagnosis_and_checkup = models.TextField(max_length=3000, default="", blank=True)  # 진단/검사 필드
    treatment = models.TextField(max_length=3000, default="", blank=True)  # 치료 필드
    nursing = models.TextField(max_length=3000, default="", blank=True)  # 간호 필드

    class Meta:
        abstract = True


class DiseaseSmallCategory(BaseDiseaseSmallCategoryModel):
    """
    질병 소분류 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 질병명
    disease_large_category = models.ForeignKey(
        "DiseaseLargeCategory",
        on_delete=models.CASCADE,
        related_name="disease_small_categories_by_large",
        null=True,
        blank=True
    )  # 연결된 질병 대분류
    disease_medium_category = models.ForeignKey(
        "DiseaseMediumCategory",
        on_delete=models.CASCADE,
        related_name="disease_small_categories_by_medium",
        null=True,
        blank=True
    )  # 연결된 질병 중분류
    like_users = models.ManyToManyField(
        "users.User",
        related_name="like_diseases",
        through="DiseaseSmallCategoryStarInfo",
        blank=True
    )

    def save(self, *args, **kwargs):
        is_new = False
        # 처음 데이터가 생성될 때(수정되는 경우가 아닌)
        if self.pk is None:
            is_new = True

        # 실제 save() 를 호출
        super().save(*args, **kwargs)

        if is_new:
            disease_small_category_edit_history = DiseaseSmallCategoryEditHistory.objects.create(
                original_disease_small_category=self,
                definition=self.definition,
                cause=self.cause,
                symptom=self.symptom,
                diagnosis_and_checkup=self.diagnosis_and_checkup,
                treatment=self.treatment,
                nursing=self.nursing,
            )

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('nursing_knowledges:disease_detail', args=[self.id])


class DiseaseSmallCategoryStarInfo(models.Model):
    """
    DiseaseSmallCategory의 like_users(M2M)의 through 속성에 해당 되는 Model
    """
    disease_small_category = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE)
    like_user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="disease_small_category_star_infoes")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)  # null/blank 옵션은 서버 배포시 지워야 할 사항

    def __str__(self):
        return f"[{self.disease_small_category.name}] --> [{self.like_user.username}]"

    def get_created_at(self):
        return self.created_at.astimezone().strftime('%Y-%m-%d %H:%M:%S')


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


class BaseDiagnosisSmallCategoryModel(models.Model):
    """
    진단 소분류 & 진단 소분류 History Model을 상속할 Abstract Model
    """
    definition = models.TextField(max_length=3000, default="", blank=True)  # 진단의 정의
    intervention_content = models.TextField(max_length=3000, default="", blank=True)  # 진단이 가지는 중재들을 설명하는 필드

    def get_intervention_list(self):
        return self.intervention_content.split("\n") if True else ""

    class Meta:
        abstract = True


class DiagnosisSmallCategory(BaseDiagnosisSmallCategoryModel):
    """
    간호 진단 소분류 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 진단명
    diagnosis_medium_category = models.ForeignKey(
        "DiagnosisMediumCategory",
        on_delete=models.CASCADE,
        related_name="diagnosis_small_categories",
        null=True,
        blank=True
    )  # 연결된 진단 중분류, null,blank=True는 추후 삭제될 예정
    like_users = models.ManyToManyField(
        "users.User",
        related_name="like_diagnoses",
        through="DiagnosisSmallCategoryStarInfo",
        blank=True
    )

    def save(self, *args, **kwargs):
        is_new = False
        # 처음 데이터가 생성될 때(수정되는 경우가 아닌)
        if self.pk is None:
            is_new = True

        # 실제 save() 를 호출
        super().save(*args, **kwargs)

        if is_new:
            diagnosis_small_category_edit_history = DiagnosisSmallCategoryEditHistory.objects.create(
                original_diagnosis_small_category=self,
                definition=self.definition,
                intervention_content=self.intervention_content,
            )

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('nursing_knowledges:diagnosis_detail', args=[self.id])


class DiagnosisSmallCategoryStarInfo(models.Model):
    """
    DiagnosisSmallCategory의 like_users(M2M)의 through 속성에 해당 되는 Model
    """
    diagnosis_small_category = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE)
    like_user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="diagnosis_small_category_star_infoes")
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)  # null/blank 옵션은 서버 배포시 지워야 할 사항

    def __str__(self):
        return f"[{self.diagnosis_small_category.name}] --> [{self.like_user.username}]"

    def get_created_at(self):
        return self.created_at.astimezone().strftime('%Y-%m-%d %H:%M:%S')


class BaseDiagnosisRelatedDiagnosisModel(models.Model):
    """
    진단 소분류의 관련 진단 & 진단 소분류 관련 진단 Edit History Model을 상속할 Abstract Model
    """
    related_diagnosis_name = models.CharField(max_length=50)
    intervention_content = models.TextField(max_length=3000, default="", blank=True)

    def get_intervention_list(self):
        return self.intervention_content.split("\n") if True else ""

    class Meta:
        abstract = True


class DiagnosisRelatedDiagnosis(BaseDiagnosisRelatedDiagnosisModel):
    """
    간호 진단 Model의 related_diagnoses의 FK Model
    """
    target_diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE,
                                         related_name="DiagnosisRelatedDiagnoses")
    like_users = models.ManyToManyField("users.User", related_name="like_related_diagnoses", blank=True)

    def __str__(self):
        return f"[{self.target_diagnosis.name}] -> [{self.related_diagnosis_name}]"


class DiagnosisInterventionAlpha(models.Model):
    """
    간호 진단의 중재 내용에,
    어떤 질병인지에 따라 추가로 들어가는 중재 내용 Model
    """
    diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, related_name="alphas")
    disease_medium_category = models.ForeignKey("DiseaseMediumCategory", on_delete=models.CASCADE, null=True,
                                                blank=True)  # 질병 중분류
    disease_small_category = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE, null=True,
                                               blank=True)  # 질병 소분류
    content = models.TextField(max_length=3000)


class DiagnosisToDisease(models.Model):
    """
    노드의 연결관계를 나타내는 Model
    질병(중분류 or 소분류) <--> 진단
    """
    disease_medium_category = models.ForeignKey("DiseaseMediumCategory", on_delete=models.CASCADE, null=True,
                                                blank=True)  # 질병 중분류
    disease_small_category = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE, null=True,
                                               blank=True)  # 질병 소분류
    diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, null=True, blank=True)  # 진단

    def save(self, is_created_by_script=False, *args, **kwargs):
        # 실제 save() 를 호출
        super().save(*args, **kwargs)

        # excel파일을 통해 처음 DB를 생성할때만 작동하는 코드
        if is_created_by_script and self.disease_small_category:
            disease_small_category_edit_history = DiseaseSmallCategoryEditHistory.objects\
                .get(original_disease_small_category=self.disease_small_category)
            disease_small_category_edit_history_related_diagnosis = DiseaseSmallCategoryRelatedDiagnosisEditHistory\
                .objects\
                .create(
                    disease_small_category_edit_history=disease_small_category_edit_history,
                    diagnosis_small_category=self.diagnosis
                )

    def __str__(self):
        nodes = []
        if self.disease_small_category:
            nodes.append(f"[{self.disease_small_category.__class__.__name__}]{self.disease_small_category}")
        if self.disease_medium_category:
            nodes.append(f"[{self.disease_medium_category.__class__.__name__}]{self.disease_medium_category}")
        if self.diagnosis:
            nodes.append(f"[{self.diagnosis.__class__.__name__}]{self.diagnosis}")

        return f"{nodes.pop()} <--> {nodes.pop()}"


class BaseKnowledgeEditHistoryModel(models.Model):
    """
    질병 소분류 Edit History & 진단 소분류 Edit History Model을 상속할 Abstract Model
    """
    editor = models.ForeignKey("users.User", on_delete=models.CASCADE, null=True, blank=True)
    changed_word_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    version = models.PositiveIntegerField(blank=True)

    class Meta:
        abstract = True


class DiseaseSmallCategoryEditHistory(BaseDiseaseSmallCategoryModel, BaseKnowledgeEditHistoryModel):
    """
    질병 소분류의 편집 히스토리를 나타내는 Model
    """
    original_disease_small_category = models.ForeignKey(
        "DiseaseSmallCategory",
        on_delete=models.CASCADE,
        null=True,
        related_name="disease_small_category_edit_histories"
    )

    def save(self, *args, **kwargs):
        # 처음 데이터가 생성될 때(수정되는 경우가 아닌)
        if self.pk is None:
            last_data = DiseaseSmallCategoryEditHistory.objects\
                .filter(original_disease_small_category=self.original_disease_small_category)\
                .last()

            if last_data:
                before_version = last_data.version
            else:
                before_version = 0

            self.version = before_version + 1

        # 실제 save() 를 호출
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.original_disease_small_category.name} - {self.version}번째 수정본"


class DiseaseSmallCategoryRelatedDiagnosisEditHistory(models.Model):
    """
    질병 소분류의 편집 히스토리의 관련 진단 Model
    """
    disease_small_category_edit_history = models.ForeignKey(
        "DiseaseSmallCategoryEditHistory",
        on_delete=models.CASCADE,
        related_name="disease_small_category_related_diagnosis_edit_histories"
    )
    diagnosis_small_category = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE)

    def __str__(self):
        return f"[{self.disease_small_category_edit_history}]의 관련 진단 - {self.diagnosis_small_category.name}"


class DiagnosisSmallCategoryEditHistory(BaseDiagnosisSmallCategoryModel, BaseKnowledgeEditHistoryModel):
    """
    진단 소분류의 편집 히스토리를 나타내는 Model
    """
    original_diagnosis_small_category = models.ForeignKey(
        "DiagnosisSmallCategory",
        on_delete=models.CASCADE,
        null=True,
        related_name="diagnosis_small_category_edit_histories"
    )

    def save(self, *args, **kwargs):
        # 처음 데이터가 생성될 때(수정되는 경우가 아닌)
        if self.pk is None:
            last_data = DiagnosisSmallCategoryEditHistory.objects\
                .filter(original_diagnosis_small_category=self.original_diagnosis_small_category)\
                .last()

            if last_data:
                before_version = last_data.version
            else:
                before_version = 0

            self.version = before_version + 1

        # 실제 save() 를 호출
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.original_diagnosis_small_category.name} - {self.version}번째 수정본"


class DiagnosisRelatedDiagnosisEditHistory(BaseDiagnosisRelatedDiagnosisModel):
    """
    진단 소분류 관련 진단 Edit History Model
    """
    diagnosis_small_category_edit_history = models.ForeignKey(
        "DiagnosisSmallCategoryEditHistory",
        on_delete=models.CASCADE,
        related_name="diagnosis_small_category_related_diagnosis_edit_histories"
    )

    def __str__(self):
        return f"[{self.diagnosis_small_category_edit_history}]의 관련 진단 - {self.related_diagnosis_name}"


class KnowledgeEditHistory(models.Model):
    """
    질병, 진단을 수정한 사람의 정보와, 시간대가 나와있는 모델
    """
    disease = models.ForeignKey("DiseaseSmallCategory", on_delete=models.CASCADE, null=True, blank=True)
    diagnosis = models.ForeignKey("DiagnosisSmallCategory", on_delete=models.CASCADE, null=True, blank=True)
    editor = models.ForeignKey("users.User", on_delete=models.CASCADE, null=True, blank=True)
    changed_word_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

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
