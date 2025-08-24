from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer


class RegisterView(generics.CreateAPIView):
    """
    User registration endpoint.
    POST /api/auth/register/
    Creates a new user account and returns user data with JWT tokens.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Create the user
        user = serializer.save()
        
        # Generate JWT tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        # Return user data with tokens
        user_serializer = UserSerializer(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': user_serializer.data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom JWT login endpoint that accepts email instead of username.
    POST /api/auth/login/
    """
    def post(self, request, *args, **kwargs):
        # Use our custom LoginSerializer for validation
        login_serializer = LoginSerializer(data=request.data)
        login_serializer.is_valid(raise_exception=True)
        
        user = login_serializer.validated_data['user']
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        # Return user data with tokens
        user_serializer = UserSerializer(user)
        
        return Response({
            'message': 'Login successful',
            'user': user_serializer.data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    Get current user profile.
    GET /api/auth/me/
    Requires JWT authentication.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Return the current user's profile data."""
        serializer = UserSerializer(request.user)
        return Response({
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request):
        """Update the current user's profile data."""
        serializer = UserSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Profile updated successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Logout endpoint that blacklists the refresh token.
    POST /api/auth/logout/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """Blacklist the refresh token to logout the user."""
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({
                    'message': 'Successfully logged out'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Refresh token is required'
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': 'Invalid token'
            }, status=status.HTTP_400_BAD_REQUEST)


# Optional: Function-based view for testing
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for testing."""
    return Response({
        'message': 'Users API is working!',
        'status': 'healthy'
    }, status=status.HTTP_200_OK)