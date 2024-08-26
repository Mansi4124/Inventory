from django.urls import path
from .views import (
    sign_in,
    sign_up,
    get_customer_data,
    add_organization,
    get_organization_data,
)

urlpatterns = [
    path("sign_in/", sign_in),
    path("sign_up/", sign_up),
    path("get_customer_data/", get_customer_data),
    path("add_organization/", add_organization),
    path("get_organization_data/", get_organization_data),
]
