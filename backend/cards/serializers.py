from rest_framework import serializers
from .models import Card
from boards.serializers import BoardSerializer

class CardSerializer(serializers.ModelSerializer):
    board = BoardSerializer(read_only=True)

    class Meta:
        model = Card
        fields = ['id', 'title', 'description', 'board', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']