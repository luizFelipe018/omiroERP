from django.http import HttpResponse
from django.shortcuts import render, redirect
from .models import Products
from django.contrib import messages

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
        
        try:
            product = Products.objects.get(code_bar=code_bar)
            product.quantity += int(quantity)
            product.save()
            messages.success(request, f'Quantidade de "{product.name}" atualizada com sucesso.')
        except Products.DoesNotExist:
            messages.error(request, 'Produto com o código de barras fornecido não existe.')
        
        return redirect('register_quantity_product') 
    return render(request, 'usuarios/receipt.html')


def finance(request):
   return render(request, 'usuarios/finance_control.html')


""" API endpoints
"""
def API_get_product(request, code_bar):
    if request.method != 'GET':
        return HttpResponse('utilize requisições "GET"', status=400)

    product = None
    try:
        product = Products.objects.get(code_bar=code_bar)
    except:
        return HttpResponse('produto não encontrado', status=404)

    # we have access to product here

    return HttpResponse('produto encontrado', status=200)
