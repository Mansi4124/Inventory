from django.urls import path
from .views import (
    sign_in,
    sign_up,
    get_customer_data,
    add_organization,
    get_organization_data,
    update_organization,
    get_profile,
    update_profile,
    contact_us,
    get_contact_queries,
    send_email,
    add_item,
    get_items,
    add_sales
    
)

urlpatterns = [
    path("sign_in/", sign_in),
    path("sign_up/", sign_up),
    path("get_customer_data/", get_customer_data),
    path("add_organization/", add_organization),
    path("get_organization_data/", get_organization_data),
    path("update_organization/", update_organization),
    path("get_profile/", get_profile),
    path("update_profile/", update_profile),
     path("contact_us/", contact_us),
     path('get_contact_queries/',get_contact_queries),
      path('send_email/', send_email),
      path("add_item/", add_item),
path("get_items/", get_items),
path("add_sales/", add_sales),
]
