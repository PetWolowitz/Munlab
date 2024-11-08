from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, TokenUserSerializer
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    def post(self, request):
        print("Received registration data:", request.data)  # Log dei dati ricevuti
        serializer = UserSerializer(data=request.data)
        try:
            if serializer.is_valid():
                print("Serializer is valid")  # Log validazione
                try:
                    validate_password(request.data['password'])
                except ValidationError as e:
                    print("Password validation error:", e.messages)  # Log errori password
                    return Response({'password': e.messages}, status=status.HTTP_400_BAD_REQUEST)
                
                user = serializer.save()
                print("User created successfully:", user)  # Log creazione utente
                return Response({
                    'message': 'Utente registrato con successo',
                    'user': UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            
            print("Serializer errors:", serializer.errors)  # Log errori serializer
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print("Registration error:", str(e))  # Log errori generici
            return Response({
                'message': 'Si è verificato un errore durante la registrazione',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ApproveAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if not request.user.is_super_admin:
            return Response({
                'error': 'Non hai i permessi per approvare gli amministratori'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            admin_user = CustomUser.objects.get(
                id=user_id, 
                user_type='admin', 
                is_approved=False
            )
            
            admin_user.approve_user(approved_by=request.user)

            return Response({
                'message': 'Amministratore approvato con successo',
                'user': UserSerializer(admin_user).data
            })
        except CustomUser.DoesNotExist:
            return Response({
                'error': 'Utente non trovato'
            }, status=status.HTTP_404_NOT_FOUND)

class PendingAdminsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_super_admin:
            return Response({
                'error': 'Non hai i permessi per visualizzare gli amministratori in attesa'
            }, status=status.HTTP_403_FORBIDDEN)

        pending_admins = CustomUser.objects.filter(
            user_type='admin',
            is_approved=False
        )
        
        return Response({
            'pending_admins': UserSerializer(pending_admins, many=True).data
        })

class SocialAuthView(APIView):
    def post(self, request):
        try:
            token = request.data.get('token')
            provider = request.data.get('provider')
            
            if provider == 'google':
                user_data = verify_google_token(token)
            elif provider == 'facebook':
                user_data = verify_facebook_token(token)
            else:
                return Response({
                    'error': 'Provider non supportato'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Crea o aggiorna utente
            user, created = CustomUser.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'username': user_data.get('username', user_data['email']),
                    'first_name': user_data.get('first_name', ''),
                    'last_name': user_data.get('last_name', ''),
                    'user_type': 'user',
                    'is_approved': True  # Gli utenti social sono automaticamente approvati
                }
            )
            
            # Genera token JWT
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })
            
        except Exception as e:
            return Response({
                'error': 'Errore durante l\'autenticazione social',
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class CheckApprovalStatus(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'is_approved': request.user.is_approved,
            'user_type': request.user.user_type
        })
    
# Nuova view per validare il token JWT
class ValidateTokenView(APIView):
    """
    Vista per validare il token JWT e restituire informazioni sull'utente
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = TokenUserSerializer(user)
        return Response({
            'valid': True,
            'user': serializer.data
        })