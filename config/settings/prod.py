from .base import *

ALLOWED_HOSTS = ['34.204.36.26', 'localhost', '.nurpi.co.kr']
STATIC_ROOT = BASE_DIR / 'static/'
STATICFILES_DIRS = []
DEBUG = False

MY_URL = "34.204.36.26"

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'nurpi-db',
#         'USER': 'postgres',
#         'PASSWORD': 'QZepqvTLad',
#         'HOST': 'nurpi-db.ceosuratl2js.ap-northeast-2.rds.amazonaws.com',
#         'PORT': '5432',
#     }
# }