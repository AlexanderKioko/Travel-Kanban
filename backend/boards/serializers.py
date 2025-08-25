from rest_framework import serializers
from .models import Board, List, Card
from users.serializers import UserSerializer

class CardSerializer(serializers.ModelSerializer):
    assigned_members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Card
        fields = [
            'id', 'list', 'title', 'description', 'budget', 'people_number', 'tags',
            'due_date', 'assigned_members', 'subtasks', 'attachments', 'location',
            'position', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = [
            'id', 'board', 'title', 'color', 'position', 'cards', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    lists = ListSerializer(many=True, read_only=True)

    class Meta:
        model = Board
        fields = [
            'id', 'title', 'description', 'owner', 'members', 'status', 'budget', 'currency',
            'start_date', 'end_date', 'is_favorite', 'tags', 'cover_image', 'lists',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']