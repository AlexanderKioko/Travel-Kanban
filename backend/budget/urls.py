from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.BudgetCategoryListCreateView.as_view(), name='budget-category-list'),
    path('categories/<int:pk>/', views.BudgetCategoryDetailView.as_view(), name='budget-category-detail'),
    path('', views.BudgetListCreateView.as_view(), name='budget-list'),
    path('<int:pk>/', views.BudgetDetailView.as_view(), name='budget-detail'),
    path('items/', views.BudgetItemListCreateView.as_view(), name='budget-item-list'),
    path('items/<int:pk>/', views.BudgetItemDetailView.as_view(), name='budget-item-detail'),
]
