# Generated by Django 5.0.7 on 2024-08-13 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_supermercado', '0002_products_purchase_price_receipt'),
    ]

    operations = [
        migrations.AlterField(
            model_name='products',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=10),
        ),
    ]
