from django import forms
from .models import User


class SigninForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "username",
        )
        widgets = {
            "username": forms.TextInput(attrs={
                "placeholder": "아이디",
                "required": True,
                "autocomplete": "username"
            }),
        }
    
    current_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            "placeholder": "비밀번호",
            "required": True,
            "autocomplete": "current-password",
            })
    )

    def clean(self):
        username = self.cleaned_data.get("username")
        password = self.cleaned_data.get("current_password")
        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                return self.cleaned_data
            else:
                self.add_error("current_password", forms.ValidationError("비밀번호가 틀렸습니다.", code="wrong_password"))
        except User.DoesNotExist:
            self.add_error("username", forms.ValidationError("존재하지 않는 계정입니다.", code="not_existing_user"))


class SignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "username",
            "email",
        )
        widgets = {
            "username": forms.TextInput(attrs={"placeholder": "아이디", "required": True}),
            "email": forms.EmailInput(attrs={"placeholder": "이메일(선택)"}),
        }
    
    current_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
                "placeholder": "비밀번호",
                "required": True,
                "autocomplete": "current-password",
            })
    )

    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            "placeholder": "비밀번호 확인",
            "required": True,
            "autocomplete": "confirm-password",
            })
    )

    def clean_username(self):
        username = self.cleaned_data.get("username")
        try:
            User.objects.get(username=username)
            raise forms.ValidationError("존재하는 아이디 입니다.", code="existing_username")
        except User.DoesNotExist:
            return username

    def clean_confirm_password(self):
        current_password = self.cleaned_data.get("current_password")
        confirm_password = self.cleaned_data.get("confirm_password")
        if current_password != confirm_password:
            raise forms.ValidationError("비밀번호가 일치하지 않습니다.", code="not_matching_password")
        else:
            return confirm_password


class KakaoSignupForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "kakao_id",
        )
        widgets = {
            "username": forms.TextInput(attrs={"placeholder": "아이디", "required": True}),
            "email": forms.EmailInput(attrs={"placeholder": "이메일(선택)"}),
            "kakao_id": forms.TextInput(),
        }

    def clean_username(self):
        username = self.cleaned_data.get("username")
        try:
            User.objects.get(username=username)
            raise forms.ValidationError("존재하는 아이디 입니다.", code="existing_username")
        except User.DoesNotExist:
            return username


class UpdateProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = (
            "username",
            "email",
        )
        widgets = {
            "username": forms.TextInput(attrs={"placeholder": "아이디"}),
            "email": forms.EmailInput(attrs={"placeholder": "이메일"}),
        }
        labels = {
            "username": "아이디",
            "email": "이메일",
        }

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(UpdateProfileForm, self).__init__(*args, **kwargs)

    def clean_username(self):
        username = self.cleaned_data.get("username")
        try:
            user = User.objects.get(username=username)
            if user == self.request.user:
                return username
            else:
                raise forms.ValidationError("존재하는 아이디 입니다.", code="existing_username")
        except User.DoesNotExist:
            return username