from django.urls import path
from . import views
from .views import log_price_calculation,get_history

urlpatterns = [
    path('', views.hello_world),
    path('api/log/', log_price_calculation, name='log_price_calculation'),
    path('api/history/', get_history, name='get_history'),
]