from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    is_kakao = models.BooleanField(default=False)  # 카카오 소셜 로그인 계정인지를 나타내는 필드
    kakao_id = models.PositiveIntegerField(null=True, unique=True)  # 카카오 계정의 id값(카카오 서버에서의 id 고유값)