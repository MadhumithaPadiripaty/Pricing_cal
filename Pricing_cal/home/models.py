from django.db import models

# Create your models here.
# pricing/models.py

from django.db import models
from django.utils import timezone

class PriceCalculationLog(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    day = models.CharField(max_length=20)
    dbp = models.FloatField()
    dap = models.FloatField()
    totaldistance = models.FloatField()
    tstart = models.CharField(max_length=10)
    tend = models.CharField(max_length=10)
    wc_total = models.FloatField()
    total_price = models.FloatField()
    def __str__(self):
        return f'Log {self.id} - ₹{self.total_price:.2f}'

