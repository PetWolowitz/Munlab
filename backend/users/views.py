from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from django.conf import settings
from django.utils import timezone
from django.db.models import Q
from .serializers import (
    UserSerializer, 
    AdminApprovalSerializer, 
    UserUpdateSerializer,
    TokenUserSerializer
)
from django.contrib.auth import authenticate
from .models import CustomUser

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            
            # Prepara i token
            tokens = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }

            # Se è un admin
            if user.user_type == 'admin':
                # Trova tutti i super admin
                super_admins = CustomUser.objects.filter(user_type='super_admin')
                
                # Email per i super admin
                admin_context = {
                    'admin_name': f"{user.first_name} {user.last_name}",
                    'admin_email': user.email,
                    'approval_link': f"{settings.FRONTEND_URL}/admin/approve/{user.id}"
                }
                
                admin_html = render_to_string('emails/admin_approval_request.html', admin_context)
                admin_text = strip_tags(admin_html)
                
                # Invia email a tutti i super admin
                for super_admin in super_admins:
                    email = EmailMultiAlternatives(
                        subject='Nuova richiesta di approvazione admin',
                        body=admin_text,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        to=[super_admin.email]
                    )
                    email.attach_alternative(admin_html, "text/html")
                    email.send()

                # Email di benvenuto per il nuovo admin
                welcome_context = {
                    'name': user.first_name,
                }
                welcome_html = render_to_string('emails/admin_welcome.html', welcome_context)
                welcome_text = strip_tags(welcome_html)
                
                welcome_email = EmailMultiAlternatives(
                    subject='Registrazione amministratore effettuata',
                    body=welcome_text,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email]
                )
                welcome_email.attach_alternative(welcome_html, "text/html")
                welcome_email.send()

                return Response({
                    'user': serializer.data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    },
                    'message': 'Registrazione admin completata. In attesa di approvazione.',
                    'requires_approval': True
                }, status=status.HTTP_201_CREATED)
            
            # Se è un utente normale
            else:
                # Invia email di benvenuto all'utente
                user_context = {
                    'name': user.first_name,
                    'login_url': f"{settings.FRONTEND_URL}/login"
                }
                user_html = render_to_string('emails/user_welcome.html', user_context)
                user_text = strip_tags(user_html)
                
                email = EmailMultiAlternatives(
                    subject='Benvenuto su MunLab!',
                    body=user_text,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[user.email]
                )
                email.attach_alternative(user_html, "text/html")
                email.send()

                return Response({
                    'user': serializer.data,
                    'tokens': tokens,
                    'message': 'Registrazione completata con successo!'
                }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ValidateTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = TokenUserSerializer(request.user)
        return Response({
            'valid': True,
            'user': serializer.data
        })
class ApproveAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            # Verifica che l'utente che fa la richiesta sia un super admin
            if request.user.user_type != 'super_admin':
                return Response({
                    'error': 'Non hai i permessi necessari'
                }, status=status.HTTP_403_FORBIDDEN)

            admin_user = CustomUser.objects.get(id=user_id, user_type='admin')
            approved = request.data.get('approved', True)

            if approved:
                # Approva l'admin
                admin_user.approve(request.user)
                
                # Invia email di conferma
                context = {
                    'name': admin_user.first_name,
                    'login_url': f"{settings.FRONTEND_URL}/login"
                }
                html_content = render_to_string('emails/admin_approved.html', context)
                text_content = strip_tags(html_content)
                
                email = EmailMultiAlternatives(
                    subject='Account Amministratore Approvato',
                    body=text_content,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[admin_user.email]
                )
                email.attach_alternative(html_content, "text/html")
                email.send()
                
                message = 'Admin approvato con successo'
            else:
                # Rifiuta l'admin
                admin_user.delete()  # O imposta un flag "rejected" se preferisci mantenere il record
                
                # Invia email di rifiuto
                context = {
                    'name': admin_user.first_name
                }
                html_content = render_to_string('emails/admin_rejected.html', context)
                text_content = strip_tags(html_content)
                
                email = EmailMultiAlternatives(
                    subject='Richiesta Account Amministratore Rifiutata',
                    body=text_content,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[admin_user.email]
                )
                email.attach_alternative(html_content, "text/html")
                email.send()
                
                message = 'Richiesta admin rifiutata'

            return Response({'message': message})

        except CustomUser.DoesNotExist:
            return Response(
                {'error': 'Utente non trovato'},
                status=status.HTTP_404_NOT_FOUND
            )

class PendingAdminsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Verifica che l'utente sia un super admin
        if request.user.user_type != 'super_admin':
            return Response({
                'error': 'Non hai i permessi necessari'
            }, status=status.HTTP_403_FORBIDDEN)

        pending_admins = CustomUser.objects.filter(
            user_type='admin',
            is_approved=False
        )
        serializer = AdminApprovalSerializer(pending_admins, many=True)
        return Response(serializer.data)
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Per favore, inserisci username e password'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({
                'error': 'Credenziali non valide'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if user.user_type == 'admin' and not user.is_approved:
            return Response({
                'error': 'Account admin in attesa di approvazione',
                'requires_approval': True
            }, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            },
            'message': 'Login effettuato con successo'
        })
class ApproveAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            # Verifica che l'utente che fa la richiesta sia un super admin
            if request.user.user_type != 'super_admin':
                return Response({
                    'error': 'Non hai i permessi necessari'
                }, status=status.HTTP_403_FORBIDDEN)

            admin_user = CustomUser.objects.get(id=user_id, user_type='admin')
            
            # Aggiorna lo stato dell'admin
            admin_user.is_approved = True
            admin_user.approved_by = request.user
            admin_user.approval_date = timezone.now()
            admin_user.save()
            
            # Invia email di approvazione
            context = {
                'name': admin_user.first_name,
                'login_url': f"{settings.FRONTEND_URL}/login"
            }
            html_content = render_to_string('emails/admin_approved.html', context)
            text_content = strip_tags(html_content)
            
            email = EmailMultiAlternatives(
                subject='Il tuo account admin è stato approvato!',
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[admin_user.email]
            )
            email.attach_alternative(html_content, "text/html")
            email.send()
            
            return Response({
                'message': 'Admin approvato con successo'
            })

        except CustomUser.DoesNotExist:
            return Response({
                'error': 'Utente non trovato'
            }, status=status.HTTP_404_NOT_FOUND)

class PendingAdminsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Verifica che l'utente sia un super admin
        if request.user.user_type != 'super_admin':
            return Response({
                'error': 'Non hai i permessi necessari'
            }, status=status.HTTP_403_FORBIDDEN)

        pending_admins = CustomUser.objects.filter(
            user_type='admin',
            is_approved=False
        )
        serializer = AdminApprovalSerializer(pending_admins, many=True)
        return Response(serializer.data)

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = UserUpdateSerializer(
            request.user,
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckApprovalStatus(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.user_type != 'admin':
            return Response({
                'error': 'Solo gli admin possono verificare lo stato di approvazione'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        return Response({
            'is_approved': user.is_approved,
            'approval_date': user.approval_date
        })