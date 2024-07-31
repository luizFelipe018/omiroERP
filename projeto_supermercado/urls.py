from django.urls import path
from app_supermercado import views

urlpatterns = [
    path('', views.home, name='home'),
    path('register_product/', views.register_product, name='register_product'),
    path('registered_products/', views.registered_products_view, name='registered_products'),
    path('remove_product/', views.remove_product, name='remove_product'),
    path('receipt/',views.receipt,name='receipt'),
    path('check_stock/',views.check_stock,name='check_stock'),
    path('search_product/',views.search_product,name="search_product"),
    path('register_quantity_product/',views.register_quantity_product,name="register_quantity_product"),
    path('finance/',views.finance,name="finance"),
    path('purchase/',views.purchase,name="purchase"),
    path('api/get-product/<int:code_bar>',views.API_get_product,name="API_get_product"),
]
