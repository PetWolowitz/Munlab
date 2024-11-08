from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Aggiungiamo il prefisso 'api/' per tutte le rotte API
    path('api/', include('gestione.urls')),
    # Aggiungiamo le rotte degli utenti
    path('api/users/', include('users.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)