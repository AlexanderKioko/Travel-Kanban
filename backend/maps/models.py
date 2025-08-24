from django.db import models
from cards.models import Card 

class MapLocation(models.Model):
    card = models.OneToOneField(Card, on_delete=models.CASCADE, related_name='map_location')
    name = models.CharField(max_length=200) # e.g., "Eiffel Tower", "Hotel de Paris"
    description = models.TextField(blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6) # Standard for GPS
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.TextField(blank=True, null=True) # Optional full address string
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.card.title})"

    class Meta:
        db_table = 'map_locations'
        verbose_name = 'Map Location'
        verbose_name_plural = 'Map Locations'
        ordering = ['-created_at']