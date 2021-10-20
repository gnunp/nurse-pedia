from django.db import models

# Create your models here.

class NursingKnowledge(models.Model):
    """
    (간호 질병 + 간호 진단) Model
    """
    DISEASE = "DISEASE"  # 질병
    DIAGNOSIS = "DIAGNOSIS"  # 진단
    TYPES = [
        (DISEASE, "Disease"),
        (DIAGNOSIS, "Diagnosis"),
    ]
    
    name = models.CharField(max_length=100)  # (질병,진단)명
    type = models.CharField(max_length=20, choices=TYPES)
    connection = models.ManyToManyField("self", blank=True)  # 연결 관계

    def __str__(self):
        return f"[{self.type}]{self.name}"

class NursingInterventionContent(models.Model):
    """
    간호 중재 내용 Model
    """
    content = models.TextField(max_length=500)  # 중재 내용

    def __str__(self):
        return self.content[:50]


class KnowledgeInterventionRelation(models.Model):
    """
    어떤 질병의 -> 어떤 진단의 중재인지 관계를 나타내는 Model
    """
    intervention = models.ForeignKey("NursingInterventionContent", on_delete=models.CASCADE, related_name="relation_content")  # 어떤 중재 내용의 관계를 나타낼지
    disease = models.ForeignKey("NursingKnowledge", on_delete=models.CASCADE, related_name="relation_diseases")  # 어떤 질병의?
    diagnosis = models.ForeignKey("NursingKnowledge", on_delete=models.CASCADE, related_name="relation_diagnosis")  # 어떤 진단의?

    def __str__(self):
        return f"{self.disease} - {self.diagnosis} ==> {self.intervention}"

