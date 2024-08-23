from django.urls import path, include
from app_supermercado import views

urlpatterns = [
    path('__debug__/', include('debug_toolbar.urls')),
    path('', views.home, name='home'),
    path('register_product/', views.register_product, name='register_product'),
    path('registered_products/', views.registered_products_view, name='registered_products'),
    path('remove_product/', views.remove_product, name='remove_product'),
    path('receipt/', views.receipt, name='receipt'),
    path('check_stock/', views.check_stock, name='check_stock'),
    path('search_product/', views.search_product, name='search_product'),
    path('register_quantity_product/', views.register_quantity_product, name='register_quantity_product'),
    path('finance/', views.finance, name='finance'),
    path('cashier/', views.cashier, name='cashier'),
    path('api/get-product/<int:code_bar>/', views.API_get_product, name='API_get_product'),
    path('products-data/', views.products_data, name='products_data'),
    path('receipts-data/', views.receipts_data, name='receipts_data'),
    path('product-distribution-data/', views.product_distribution_data, name='product_distribution_data'),
    path('monthly-product-value/<int:year>/', views.monthly_product_value_data, name='monthly_product_value_data'),
]