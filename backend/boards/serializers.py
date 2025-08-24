from rest_framework import serializers
from .models import Board
from users.serializers import UserSerializer

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Board
        fields = ['id', 'title', 'description', 'owner', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']