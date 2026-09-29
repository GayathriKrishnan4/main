from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import (
    PatientProfile,
    Medicine,
    MedicationDose,
    CaretakerRelationship,
)

from .serializers import (
    PatientProfileSerializer,
    MedicineSerializer,
    MedicationDoseSerializer,
    CaretakerRelationshipSerializer,
)


class PatientProfileViewSet(viewsets.ModelViewSet):
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return PatientProfile.objects.all()

        if user.role == 'caretaker':
            return PatientProfile.objects.filter(
                user__caretaker_connections__caretaker=user,
                user__caretaker_connections__is_active=True
            )

        return PatientProfile.objects.filter(user=user)


class MedicineViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return Medicine.objects.all()

        if user.role == 'caretaker':
            return Medicine.objects.filter(
                patient__caretaker_connections__caretaker=user,
                patient__caretaker_connections__is_active=True
            )

        return Medicine.objects.filter(patient=user)


class MedicationDoseViewSet(viewsets.ModelViewSet):
    serializer_class = MedicationDoseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return MedicationDose.objects.all()

        if user.role == 'caretaker':
            return MedicationDose.objects.filter(
                medicine__patient__caretaker_connections__caretaker=user,
                medicine__patient__caretaker_connections__is_active=True
            )

        return MedicationDose.objects.filter(
            medicine__patient=user
        )


class CaretakerRelationshipViewSet(viewsets.ModelViewSet):
    serializer_class = CaretakerRelationshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == 'admin':
            return CaretakerRelationship.objects.all()

        if user.role == 'caretaker':
            return CaretakerRelationship.objects.filter(
                caretaker=user,
                is_active=True
            )

        return CaretakerRelationship.objects.filter(
            patient=user,
            is_active=True
        )