from django.urls import path
from . import views

urlpatterns = [
    path('destinations/', views.DestinationListCreateView.as_view(), name='destinations'),
]
