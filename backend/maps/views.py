from rest_framework import generics, permissions, serializers
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import MapLocation
from .serializers import MapLocationSerializer
from boards.models import Card 


class MapLocationListCreateView(generics.ListCreateAPIView):
    serializer_class = MapLocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Return only map locations for cards
        that belong to boards owned by the current user.
        """
        user_boards = self.request.user.boards.all()
        cards = Card.objects.filter(board__in=user_boards)
        return MapLocation.objects.filter(card__in=cards)

    def perform_create(self, serializer):
        card_id = self.request.data.get('card_id')
        try:
            card = Card.objects.get(id=card_id)
        except Card.DoesNotExist:
            raise serializers.ValidationError({"card_id": "Card not found."})

        # Check ownership
        if card.board.owner != self.request.user:
            raise PermissionDenied("You don't have permission to add a location to this card.")

        # Prevent duplicate map locations for the same card
        if hasattr(card, 'map_location'):
            raise serializers.ValidationError({"card_id": "A location already exists for this card."})

        serializer.save(card=card)


class MapLocationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MapLocationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        """
        Return only map locations for cards
        that belong to boards owned by the current user.
        """
        user_boards = self.request.user.boards.all()
        cards = Card.objects.filter(board__in=user_boards)
        return MapLocation.objects.filter(card__in=cards)

    def perform_update(self, serializer):
        instance = serializer.instance
        if instance.card.board.owner != self.request.user:
            raise PermissionDenied("You don't have permission to edit this location.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.card.board.owner != self.request.user:
            raise PermissionDenied("You don't have permission to delete this location.")
        instance.delete()
