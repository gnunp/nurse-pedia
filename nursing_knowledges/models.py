from django.db import models
from django.db.models import Q


class Disease(models.Model):
    """
    간호 질병 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 질병명
    diagnoses = models.ManyToManyField("Diagnosis", blank=True, through="DiseaseConnect")  # 연결된 진단

    def __str__(self):
        return self.name

class DiseaseConnect(models.Model):
    """
    질병 <-> 진단의 연결관계를 나타내는  through Model
    """
    disease = models.ForeignKey("Disease", on_delete=models.CASCADE)  # 연결된 질병
    diagnosis = models.ForeignKey("Diagnosis", on_delete=models.CASCADE)  # 연결된 진단

    def save(self, *args, **kwargs):
        super(DiseaseConnect, self).save(*args, **kwargs)

        # DiagnosisConnect 모델에 같은 연결관계가 있는지 확인
        symmetry_object = DiagnosisConnect.objects.filter(Q(disease=self.disease) & Q(diagnosis=self.diagnosis))
        if not symmetry_object.exists():
            # 없으면 DiagnosisConnect 모델에 연결관계 생성
            new_object = DiagnosisConnect.objects.create(disease=self.disease, diagnosis=self.diagnosis)
            new_object.save()

    def delete(self, *args, **kwargs):
        disease = self.disease
        diagnosis = self.diagnosis
        super(DiseaseConnect, self).delete(*args, **kwargs)

        # DiagnosisConnect 모델에 같은 연결관계가 있는지 확인
        symmetry_object = DiagnosisConnect.objects.filter(Q(disease=disease) & Q(diagnosis=diagnosis))
        if symmetry_object.exists():
            # 있으면 DiagnosisConnect 모델의 관계도 삭제
            symmetry_object.delete()

    def __str__(self):
        return f"[질병]{self.disease} <-> [진단]{self.diagnosis}"

class Diagnosis(models.Model):
    """
    간호 진단 Model
    """
    name = models.CharField(max_length=100, unique=True)  # 진단명
    diseases = models.ManyToManyField("Disease", blank=True, through="DiagnosisConnect")  # 연결된 질병

    class Meta:
        verbose_name = "Diagnose"

    def __str__(self):
        return self.name

class DiagnosisConnect(models.Model):
    """
    진단 <-> 질병의 연결관계를 나타내는 through Model
    """
    disease = models.ForeignKey("Disease", on_delete=models.CASCADE)  # 연결된 질병
    diagnosis = models.ForeignKey("Diagnosis", on_delete=models.CASCADE)  # 연결된 진단

    def save(self, *args, **kwargs):
        super(DiagnosisConnect, self).save(*args, **kwargs)

        # DiseaseConnect 모델에 같은 연결관계가 있는지 확인
        symmetry_object = DiseaseConnect.objects.filter(Q(disease=self.disease) & Q(diagnosis=self.diagnosis))
        if not symmetry_object.exists():
            # 없으면 DiseaseConnect 모델에 연결관계 생성
            new_object = DiseaseConnect.objects.create(disease=self.disease, diagnosis=self.diagnosis)
            new_object.save()
    
    def delete(self, *args, **kwargs):
        disease = self.disease
        diagnosis = self.diagnosis
        super(DiagnosisConnect, self).delete(*args, **kwargs)

        # DiseaseConnect 모델에 같은 연결관계가 있는지 확인
        symmetry_object = DiseaseConnect.objects.filter(Q(disease=disease) & Q(diagnosis=diagnosis))
        if symmetry_object.exists():
            # 있으면 DiseaseConnect 모델의 관계도 삭제
            symmetry_object.delete()


    
    def __str__(self):
        return f"{self.disease} <-> {self.diagnosis}"

class InterventionContent(models.Model):
    """
    간호 중재 내용 Model
    """
    content = models.TextField(max_length=500, unique=True)  # 중재 내용

    def __str__(self):
        return self.content[:50]


class InterventionRelation(models.Model):
    """
    어떤 질병/진단 관계의 중재인지를 나타내는 Model
    """
    intervention = models.ForeignKey("InterventionContent", on_delete=models.CASCADE, related_name="intervention_relations")  # 어떤 중재 내용의 관계를 나타낼지
    connection = models.ForeignKey("DiseaseConnect", on_delete=models.CASCADE, related_name="connection_relations")  # 어떤 질병/진단 관계의?

    def __str__(self):
        return f"({self.connection}) : {self.intervention}"

