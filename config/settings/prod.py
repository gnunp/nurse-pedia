from .base import *

ALLOWED_HOSTS = ['3.38.119.71', 'localhost', '.nurpi.co.kr']
STATIC_ROOT = BASE_DIR / 'static/'
STATICFILES_DIRS = []
DEBUG = False

MY_URL = "https://nurpi.co.kr"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'nurpi-db',
        'USER': 'postgres',
        'PASSWORD': 'QZepqvTLad',
        'HOST': 'nurpi-db.ceosuratl2js.ap-northeast-2.rds.amazonaws.com',
        'PORT': '5432',
    }
}