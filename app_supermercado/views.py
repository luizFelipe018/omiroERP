from django.shortcuts import render, redirect
from .models import Receipt, Products
from django.contrib import messages
from django.http import JsonResponse
from datetime import datetime
from django.db.models import Sum,F
from django.db.models.functions import TruncMonth
from django.utils.dateparse import parse_date
import calendar
import matplotlib.pyplot as plt

def home(request):
    return render(request, 'usuarios/home.html')

def register_product(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        code_bar = request.POST.get('code_bar')
        price = request.POST.get('price')

        if Products.objects.filter(code_bar=code_bar).exists():
            messages.error(request, 'Um produto com esse código de barras já foi cadastrado.')
        else:
            new_product = Products(name=name, code_bar=code_bar, price=price)
            new_product.save()
            messages.success(request, 'Produto cadastrado com sucesso!')
            return redirect('registered_products')
    
    return render(request, 'usuarios/register_product.html')

def registered_products_view(request):
    products = Products.objects.all()
    context = {
        'products': products
    }
    return render(request, 'usuarios/registered_products.html', context)

def remove_product(request):
    if request.method == 'POST':
        code_bar = request.POST.get('code_bar')
        products = Products.objects.filter(code_bar=code_bar)
        if products.exists():
            product_name = products.first().name
            count, _ = products.delete()
            messages.success(request, f'Produto "{product_name}" removido com sucesso.')
        else:
            messages.error(request, 'Nenhum produto encontrado com esse código de barras.')
    return redirect('registered_products')

def check_stock(request):
    products = Products.objects.all()
    return render(request, 'usuarios/check_stock.html' , {'products': products})

def search_product(request):
    query = request.GET.get('query', None) 
    search_by = request.GET.get('search_by', 'code_bar')  
    products = []

    if query:
        if search_by == 'code_bar':
            products = Products.objects.filter(code_bar=query) 
        elif search_by == 'name':
            products = Products.objects.filter(name__icontains=query) 

    return render(request, 'usuarios/check_stock.html', {'products': products, 'query': query, 'search_by': search_by})


def receipt(request):
    return render(request, 'usuarios/receipt.html')

def register_quantity_product(request):
    if request.method == 'POST':
        code_bar = request.POST.get('code_bar')
        quantity = request.POST.get('quantity')
        date = request.POST.get('date') 

        try:
            product = Products.objects.get(code_bar=code_bar)
            product.quantity += int(quantity)
            product.save()
            
            date_received = datetime.strptime(date, '%Y-%m-%d').date()
            
            receipt = Receipt(
                product=product,
                quantity=int(quantity), 
                date=date_received,
                code_bar=code_bar
            )
            receipt.save()

            messages.success(request, f'Quantidade de "{product.name}" atualizada com sucesso.')
        except Products.DoesNotExist:
            messages.error(request, 'Produto com o código de barras fornecido não existe.')
        except ValueError:
            messages.error(request, 'Formato de data inválido. Use o formato YYYY-MM-DD.')
        
        return redirect('register_quantity_product')  

    return render(request, 'usuarios/receipt.html')


def finance(request):
   return render(request, 'usuarios/finance_control.html')


def cashier(request):
    return render(request, 'usuarios/cashier.html')

def API_get_product(request, code_bar):
    if request.method != 'GET':
        return JsonResponse({'value': None, 'error': 'método de requisição inválido'})

    product = None
    try:
        product = Products.objects.get(code_bar=code_bar)
    except:
        return JsonResponse({'value': None, 'error': 'produto não encontrado'})

    # TODO:
    productDict = {
            "name": product.name,
            "price": product.price,
            "code": product.code_bar,
            }

    return JsonResponse({'value': productDict, 'error': ''})

def products_data(request):
    products = Products.objects.all()
    data = {
        'labels': [product.name for product in products],
        'data': [product.quantity for product in products],
    }
    return JsonResponse(data)

def receipts_data(request):
    receipts = Receipt.objects.values('date').annotate(total_quantity=Sum('quantity'))
    data = {
        'labels': [receipt['date'] for receipt in receipts],
        'data': [receipt['total_quantity'] for receipt in receipts],
    }
    return JsonResponse(data)

def product_distribution_data(request):
    products = Products.objects.all()
    data = {
        'labels': [product.name for product in products],
        'data': [product.quantity for product in products],
    }
    return JsonResponse(data)

def monthly_product_value_data(request, year):
    # Filtra os recibos pelo ano selecionado
    receipts = Receipt.objects.filter(date__year=year).select_related('product')
    
    # Calcule o valor total por mês
    monthly_totals = {}
    for receipt in receipts:
        month = receipt.date.strftime('%Y-%m')
        total_value = receipt.quantity * receipt.product.price
        if month in monthly_totals:
            monthly_totals[month] += total_value
        else:
            monthly_totals[month] = total_value
    
    # Ordene por mês
    sorted_months = sorted(monthly_totals.keys())
    sorted_values = [monthly_totals[month] for month in sorted_months]

    data = {
        'labels': sorted_months,
        'data': sorted_values,
    }
    return JsonResponse(data)