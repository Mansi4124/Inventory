from django.urls import path
<<<<<<< Updated upstream
from .views import sign_in,sign_up,get_customer_data

urlpatterns = [
    path('sign_in/',sign_in),
    path('sign_up/',sign_up),
    path('get_customer_data/',get_customer_data),
=======
from .views import (
    sign_in,
    sign_up,
    get_customer_data,
    add_organization,
    get_organization_data,
    update_organization,
    get_profile,
    update_profile
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
>>>>>>> Stashed changes
]
