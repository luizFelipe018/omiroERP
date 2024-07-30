from django.db import models

class Products(models.Model):
    name = models.CharField(max_length=255)
    code_bar = models.CharField(max_length=255, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField(default=0)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2,default=0)
    
    def __str__(self):
        return self.name
