from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import PriceCalculationLog

def hello_world(request):
    return render(request, 'index.html')

@csrf_exempt
def log_price_calculation(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        log = PriceCalculationLog.objects.create(
            day=data.get('Day', ''),
            dbp=data.get('DBP', 0),
            dap=data.get('DAP', 0),
            totaldistance=data.get('Totaldistance', 0),
            tstart=data.get('Tstart', ''),
            tend=data.get('Tend', ''),
            wc_total=data.get('WCTotal', 0),
            total_price=data.get('total_price', 0)
        )

        return JsonResponse({'status': 'success', 'log_id': log.id})
    return JsonResponse({'error': 'Invalid method'}, status=405)


def get_history(request):
    logs = PriceCalculationLog.objects.order_by('-timestamp')[:10]
    data = [{
        'timestamp': log.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
        'day': log.day,
        'dbp': log.dbp,
        'dap': log.dap,
        'totaldistance': log.totaldistance,
        'tstart': log.tstart,
        'tend': log.tend,
        'wc_total': log.wc_total,
        'total_price': log.total_price
    } for log in logs]
    return JsonResponse({'logs': data})
