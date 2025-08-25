from rest_framework import serializers
from .models import Board, List, Card
from users.serializers import UserSerializer


class CardMoveSerializer(serializers.Serializer):
    """Serializer for moving cards between lists or reordering within lists"""
    new_list_id = serializers.IntegerField(required=False, help_text="ID of the target list (optional if reordering within same list)")
    new_position = serializers.IntegerField(help_text="New position in the target list (0-based index)")
    
    def validate_new_position(self, value):
        if value < 0:
            raise serializers.ValidationError("Position must be non-negative")
        return value


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


class BoardMemberSerializer(serializers.Serializer):
    """Serializer for adding/removing board members"""
    user_id = serializers.IntegerField(help_text="ID of the user to add/remove as a board member")