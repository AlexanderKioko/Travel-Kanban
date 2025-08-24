from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

# URL namespace for the users app
app_name = 'users'

urlpatterns = [
    # Authentication endpoints (works for both /api/auth/ and /api/users/)
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.MeView.as_view(), name='me'),
    
    # JWT token management
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Health check endpoint
    path('health/', views.health_check, name='health_check'),
    
    # Additional user management endpoints (for /api/users/ route)
    # These will be useful when you need user listing, searching, etc.
    # path('', views.UserListView.as_view(), name='user_list'),
    # path('<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
]