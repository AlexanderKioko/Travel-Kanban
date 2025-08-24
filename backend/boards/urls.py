from django.urls import path
from . import views

urlpatterns = [
    path('', views.BoardListCreateView.as_view(), name='boards'),
    path('<int:pk>/', views.BoardDetailView.as_view(), name='board-detail'),
    path('lists/', views.ListListCreateView.as_view(), name='lists'),
    path('cards/', views.CardListCreateView.as_view(), name='cards'),
]
