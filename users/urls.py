from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('signin-modal', views.signin, name="signin"),
    path('signup-modal', views.signup, name="signup"),
]