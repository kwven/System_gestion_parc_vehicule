from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AgentViewSet, UserViewSet, CustomTokenObtainPairView, CustomTokenRefreshView, RegisterUserView

router = DefaultRouter()
router.register(r'agents', AgentViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='register_user'),
]