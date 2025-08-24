from rest_framework import generics, permissions, serializers
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Card
from .serializers import CardSerializer
from boards.models import Board  # ← Import Board from boards app

class CardListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return cards from boards that belong to the current user
        user_boards = self.request.user.boards.all()
        return Card.objects.filter(board__in=user_boards)

    def perform_create(self, serializer):
        board_id = self.request.data.get('board')
        try:
            board = Board.objects.get(id=board_id)
        except Board.DoesNotExist:
            raise serializers.ValidationError("Board not found.")

        # Ensure the user owns the board
        if board.owner != self.request.user:
            raise PermissionDenied("You don't have permission to add cards to this board.")

        serializer.save(board=board)


class CardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_boards = self.request.user.boards.all()
        return Card.objects.filter(board__in=user_boards)

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        return obj