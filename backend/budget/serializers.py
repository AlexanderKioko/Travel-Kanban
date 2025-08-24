from rest_framework import serializers
from .models import Budget, BudgetItem, BudgetCategory
from boards.serializers import BoardSerializer
from users.serializers import UserSerializer

class BudgetCategorySerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = BudgetCategory
        fields = ['id', 'name', 'description', 'owner', 'created_at', 'updated_at']
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

class BudgetItemSerializer(serializers.ModelSerializer):
    category = BudgetCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=BudgetCategory.objects.all(), source='category', write_only=True, required=False
    )

    class Meta:
        model = BudgetItem
        fields = [
            'id', 'budget', 'category', 'category_id', 'description',
            'allocated_amount', 'spent_amount', 'remaining_amount',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'remaining_amount', 'created_at', 'updated_at']

class BudgetSerializer(serializers.ModelSerializer):
    board = BoardSerializer(read_only=True)
    items = BudgetItemSerializer(many=True, read_only=True)

    class Meta:
        model = Budget
        fields = [
            'id', 'title', 'description', 'board',
            'total_allocated', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
