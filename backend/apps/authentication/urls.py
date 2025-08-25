from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AgentViewSet, 
    UserViewSet, 
    CustomTokenObtainPairView, 
    CustomTokenRefreshView, 
    RegisterUserView,
    UserProfileView,
    AssignRoleView,
    GetAvailableRolesView,
    SelectActiveRoleView
)

router = DefaultRouter()
router.register(r'agents', AgentViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('assign-role/', AssignRoleView.as_view(), name='assign_role'),
    path('available-roles/', GetAvailableRolesView.as_view(), name='get_available_roles'),
    path('select-role/', SelectActiveRoleView.as_view(), name='select_active_role'),
]