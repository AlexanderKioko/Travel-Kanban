from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Board, List, Card
from .serializers import BoardSerializer, ListSerializer, CardSerializer

class BoardListCreateView(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class BoardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        if obj.owner != self.request.user:
            raise PermissionDenied("You don't have permission to access this board.")
        return obj

class ListListCreateView(generics.ListCreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board = get_object_or_404(Board, pk=self.kwargs['board_pk'], owner=self.request.user)
        return List.objects.filter(board=board)

    def perform_create(self, serializer):
        board = get_object_or_404(Board, pk=self.kwargs['board_pk'], owner=self.request.user)
        serializer.save(board=board)

class ListDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board = get_object_or_404(Board, pk=self.kwargs['board_pk'], owner=self.request.user)
        return List.objects.filter(board=board)

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        return obj

class CardListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board = get_object_or_404(Board, pk=self.kwargs['board_pk'], owner=self.request.user)
        list_obj = get_object_or_404(List, pk=self.kwargs['list_pk'], board=board)
        return Card.objects.filter(list=list_obj)

    def perform_create(self, serializer):
        board = get_object_or_404(Board, pk=self.kwargs['board_pk'], owner=self.request.user)
        list_obj = get_object_or_404(List, pk=self.kwargs['list_pk'], board=board)
        serializer.save(list=list_obj)

class CardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board = get_object_or_404(Board, pk=self.kwargs['board_pk'], owner=self.request.user)
        list_obj = get_object_or_404(List, pk=self.kwargs['list_pk'], board=board)
        return Card.objects.filter(list=list_obj)

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        return obj