from django.urls import path
from . import views

urlpatterns = [
    path('', views.CardListCreateView.as_view(), name='cards'),
    path('<int:pk>/', views.CardDetailView.as_view(), name='card-detail'),
]
