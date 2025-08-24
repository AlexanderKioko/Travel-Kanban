from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Board
from .serializers import BoardSerializer

class BoardListCreateView(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return boards owned by the current user
        return Board.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        # Set the owner to the current user
        serializer.save(owner=self.request.user)


class BoardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs['pk'])
        # Optional: extra check
        if obj.owner != self.request.user:
            raise PermissionDenied("You don't have permission to access this board.")
        return obj


# Optional: List views for cards and lists (placeholders for now)
class ListListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        return generics.Response({"message": "ListListCreateView placeholder - implement later"}, status=200)


class CardListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        return generics.Response({"message": "CardListCreateView placeholder - implement later"}, status=200)