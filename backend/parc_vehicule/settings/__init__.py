from .base import *

# Import environment-specific settings
try:
    from .development import *
except ImportError:
    pass

try:
    from .production import *
except ImportError:
    pass