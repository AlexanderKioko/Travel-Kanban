from django.db import models
from users.models import User

class Board(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='boards')
    members = models.ManyToManyField(User, related_name='member_boards', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=3, default='USD')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_favorite = models.BooleanField(default=False)
    tags = models.JSONField(default=list)
    cover_image = models.ImageField(upload_to='board_covers/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Ensure owner is always a member
        if self.owner not in self.members.all():
            self.members.add(self.owner)

    class Meta:
        db_table = 'boards'
        ordering = ['-created_at']

class List(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE, related_name='lists')
    title = models.CharField(max_length=200)
    color = models.CharField(max_length=20, default='blue')
    position = models.PositiveIntegerField(default=0) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.board.title})"

    class Meta:
        db_table = 'lists'
        ordering = ['position']

class Card(models.Model):
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='cards')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    people_number = models.PositiveIntegerField(default=1)
    tags = models.JSONField(default=list)  
    due_date = models.DateField(null=True, blank=True)
    assigned_members = models.ManyToManyField(User, blank=True, related_name='assigned_cards')
    subtasks = models.JSONField(default=list)  
    attachments = models.JSONField(default=list)  
    location = models.JSONField(default=dict, null=True, blank=True)  
    position = models.PositiveIntegerField(default=0)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.list.board.title})"

    class Meta:
        db_table = 'cards'
        ordering = ['position', '-created_at']