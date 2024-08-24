from django.urls import path
from .views import sign_in,sign_up,get_customer_data

urlpatterns = [
    path('sign_in/',sign_in),
    path('sign_up/',sign_up),
    path('get_customer_data/',get_customer_data),
]
