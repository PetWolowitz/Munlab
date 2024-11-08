from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = CustomUser
        fields = (
            'id', 
            'username', 
            'email', 
            'password', 
            'password2', 
            'first_name', 
            'last_name', 
            'user_type',
            'is_approved',
            'approval_date',
            'approved_by'
        )
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
            'is_approved': {'read_only': True},
            'approval_date': {'read_only': True},
            'approved_by': {'read_only': True}
        }

    def validate(self, attrs):
        # Verifica che le password coincidano
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Le password non coincidono"})

        # Verifica l'email
        email = attrs.get('email', '')
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Questa email è già registrata"})

        # Verifica username
        username = attrs.get('username', '')
        if not username.isalnum():
            raise serializers.ValidationError(
                {"username": "Lo username può contenere solo lettere e numeri"}
            )

        # Verifica tipo utente
        user_type = attrs.get('user_type', 'user')
        if user_type not in ['user', 'admin', 'super_admin']:
            raise serializers.ValidationError(
                {"user_type": "Tipo utente non valido"}
            )

        return attrs

    def create(self, validated_data):
        # Rimuovi password2 dai dati validati
        validated_data.pop('password2')
        
        # Se è un utente normale, viene approvato automaticamente
        if validated_data.get('user_type') == 'user':
            validated_data['is_approved'] = True
        
        # Crea l'utente
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            user_type=validated_data['user_type'],
            is_approved=validated_data.get('is_approved', False)
        )

        user.set_password(validated_data['password'])
        user.save()

        return user

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        # Rimuovi campi sensibili dalla risposta
        representation.pop('password', None)
        representation.pop('password2', None)
        
        # Aggiungi informazioni sull'approvatore se presente
        if instance.approved_by:
            representation['approved_by'] = {
                'id': instance.approved_by.id,
                'username': instance.approved_by.username,
                'email': instance.approved_by.email
            }
            
        return representation

class AdminApprovalSerializer(serializers.ModelSerializer):
    """
    Serializer per la visualizzazione degli admin in attesa di approvazione
    """
    class Meta:
        model = CustomUser
        fields = (
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'user_type',
            'is_approved',
            'approval_date'
        )
        read_only_fields = fields

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'first_name',
            'last_name',
            'email'
        )

    def validate_email(self, value):
        user = self.context['request'].user
        if CustomUser.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("Questa email è già registrata")
        return value

class TokenUserSerializer(serializers.ModelSerializer):
    """
    Serializer specifico per la validazione del token
    """
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'user_type', 'is_active', 'is_approved')
        read_only_fields = fields