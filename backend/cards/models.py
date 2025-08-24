from django.db import models
from boards.models import Board

class Card(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='cards')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'cards'
        ordering = ['-created_at']