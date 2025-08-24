from rest_framework import serializers
from .models import MapLocation
# Import the Card model and its serializer
from cards.models import Card 
from cards.serializers import CardSerializer 

class MapLocationSerializer(serializers.ModelSerializer):
    card = CardSerializer(read_only=True) # Show card details
    card_id = serializers.PrimaryKeyRelatedField(
        queryset=Card.objects.all(), source='card', write_only=True
    ) # For creation/update

    class Meta:
        model = MapLocation
        fields = [
            'id', 'card', 'card_id', 'name', 'description',
            'latitude', 'longitude', 'address',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_card_id(self, value):
        """
        Ensure the user has permission to add a location to this card.
        This check will be reinforced in the view.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            user = request.user
            # Check if the card's board belongs to the user
            if value.board.owner != user:
                 raise serializers.ValidationError("You do not have permission to add a location to this card.")
        return value
