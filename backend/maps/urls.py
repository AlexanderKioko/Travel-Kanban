from django.urls import path
from . import views

urlpatterns = [
    path('', views.MapLocationListCreateView.as_view(), name='map-location-list'),
    path('<int:pk>/', views.MapLocationDetailView.as_view(), name='map-location-detail'),
]