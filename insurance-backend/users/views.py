from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import RegisterSerializer

#create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated,]

    serializer_class = RegisterSerializer

    def get_object(self):
        return self.request.user
