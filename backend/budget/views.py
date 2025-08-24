from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Budget, BudgetItem, BudgetCategory
from .serializers import BudgetSerializer, BudgetItemSerializer, BudgetCategorySerializer
from boards.models import Board

class BudgetCategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BudgetCategory.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class BudgetCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetCategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BudgetCategory.objects.filter(owner=self.request.user)

class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_boards = self.request.user.boards.all()
        return Budget.objects.filter(board__in=user_boards)

    def perform_create(self, serializer):
        board_id = self.request.data.get('board')
        try:
            board = Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            # Use the imported 'serializers' module here
            raise serializers.ValidationError({"board": "Board not found."}) 

        if board.owner != self.request.user:
            raise PermissionDenied("You don't have permission to create a budget for this board.")

        serializer.save(board=board)

class BudgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_boards = self.request.user.boards.all()
        return Budget.objects.filter(board__in=user_boards)

class BudgetItemListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_boards = self.request.user.boards.all()
        budgets = Budget.objects.filter(board__in=user_boards)
        return BudgetItem.objects.filter(budget__in=budgets)

    def perform_create(self, serializer):
        budget_id = self.request.data.get('budget')
        try:
            budget = Budget.objects.get(id=budget_id)
        except Budget.DoesNotExist:
            # Use the imported 'serializers' module here
            raise serializers.ValidationError({"budget": "Budget not found."})

        # Check if the user owns the board associated with the budget
        if budget.board.owner != self.request.user:
            raise PermissionDenied("You don't have permission to add items to this budget.")

        serializer.save()

class BudgetItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_boards = self.request.user.boards.all()
        budgets = Budget.objects.filter(board__in=user_boards)
        return BudgetItem.objects.filter(budget__in=budgets)
