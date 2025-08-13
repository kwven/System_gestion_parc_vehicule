from .base import *

# Debug settings
DEBUG = True

# Database for development
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME', default='parc_vehicule'),
        'USER': config('DB_USER', default='parc_user'),
        'PASSWORD': config('DB_PASSWORD', default='mtl_2025_parc'),
        'HOST': config('DB_HOST', default='db'),
        'PORT': config('DB_PORT', default='5432'),
    }
}

# Email backend for development
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Additional apps for development
INSTALLED_APPS += [
    'django_extensions',
]

# CORS settings for development
CORS_ALLOW_ALL_ORIGINS = True

# Disable security features for development
SECURE_SSL_REDIRECT = False
SECURE_BROWSER_XSS_FILTER = False
SECURE_CONTENT_TYPE_NOSNIFF = False

# Cache for development (dummy cache)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Logging for development
LOGGING['handlers']['console']['level'] = 'DEBUG'
LOGGING['loggers']['django']['level'] = 'DEBUG'