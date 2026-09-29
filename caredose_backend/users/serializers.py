from rest_framework import serializers
from .models import PatientProfile, Medicine, MedicationDose, CaretakerRelationship


class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'


class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'


class MedicationDoseSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicationDose
        fields = '__all__'


class CaretakerRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaretakerRelationship
        fields = '__all__'