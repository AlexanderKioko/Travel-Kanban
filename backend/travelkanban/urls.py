"""
URL configuration for travelkanban project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def api_root(request):
    """Root API endpoint with basic info and available endpoints"""
    return JsonResponse({
        'message': 'Travel Kanban API',
        'version': '1.0.0',
        'status': 'active',
        'endpoints': {
            'authentication': '/api/auth/',
            'users': '/api/users/',
            'boards': '/api/boards/',
            'cards': '/api/cards/',
            'budget': '/api/budget/',
            'maps': '/api/maps/',
            'admin': '/admin/',
            'health': '/api/health/',
        },
        'documentation': 'Visit /admin/ for API administration'
    })

def health_check(request):
    """Health check endpoint for deployment monitoring"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'Travel Kanban API is running successfully',
        'debug_mode': settings.DEBUG
    })

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),
    
    # API root and health endpoints
    path('api/', api_root, name='api_root'),
    path('api/health/', health_check, name='health_check'),
    path('', api_root, name='home'),  # Root URL also shows API info

    # Authentication routes (separate from users for clarity)
    path('api/auth/', include('users.urls')),
    
    # API routes for different apps
    path('api/users/', include('users.urls')),  # Keep this if you have user management endpoints
    path('api/boards/', include('boards.urls')),
    path('api/cards/', include('cards.urls')),
    path('api/budget/', include('budget.urls')),
    path('api/maps/', include('maps.urls')),
]

# Serve media and static files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])