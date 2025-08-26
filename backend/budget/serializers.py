from rest_framework import serializers
from .models import Expense
from users.serializers import UserSerializer

class ExpenseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Expense
        fields = [
            'id', 'board', 'title', 'amount', 'category', 'date', 'notes',
            'created_by', 'created_at', 'updated_at', 'currency'
        ]
        read_only_fields = ['id', 'board', 'created_by', 'created_at', 'updated_at', 'currency']

    def validate_currency(self, value):
        board = self.context.get('board')
        if board and value != board.currency:
            raise serializers.ValidationError("Currency must match the board's currency.")
        return value