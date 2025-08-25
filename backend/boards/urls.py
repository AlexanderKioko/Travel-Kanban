from django.urls import path
from . import views

urlpatterns = [
    path('', views.BoardListCreateView.as_view(), name='boards'),
    path('<int:pk>/', views.BoardDetailView.as_view(), name='board-detail'),
    path('<int:board_pk>/lists/', views.ListListCreateView.as_view(), name='board-lists'),
    path('<int:board_pk>/lists/<int:pk>/', views.ListDetailView.as_view(), name='board-list-detail'),
    path('<int:board_pk>/lists/<int:list_pk>/cards/', views.CardListCreateView.as_view(), name='list-cards'),
    path('<int:board_pk>/lists/<int:list_pk>/cards/<int:pk>/', views.CardDetailView.as_view(), name='list-card-detail'),
]