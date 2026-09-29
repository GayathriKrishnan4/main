from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('caretaker', 'Caretaker'),
        ('admin', 'Admin'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='patient'
    )

    phone = models.CharField(
        max_length=15,
        blank=True
    )

    def __str__(self):
        return f"{self.username} ({self.role})"


class PatientProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )
    date_of_birth = models.DateField(
        null=True,
        blank=True
    )
    gender = models.CharField(
        max_length=20,
        blank=True
    )
    weight = models.FloatField(
        null=True,
        blank=True
    )
    pulse = models.IntegerField(
        null=True,
        blank=True
    )
    medical_conditions = models.TextField(
        blank=True
    )
    allergies = models.TextField(
        blank=True
    )
    emergency_contact = models.CharField(
        max_length=15,
        blank=True
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"


class Medicine(models.Model):
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='medicines'
    )
    name = models.CharField(
        max_length=100
    )
    dosage = models.CharField(
        max_length=100
    )
    frequency = models.CharField(
        max_length=100
    )
    start_date = models.DateField()
    end_date = models.DateField(
        null=True,
        blank=True
    )
    food_timing = models.CharField(
        max_length=50,
        blank=True
    )
    dose_count = models.PositiveIntegerField(
        default=1
    )
    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.name} - {self.patient.username}"


class MedicationDose(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('taken', 'Taken'),
        ('missed', 'Missed'),
        ('snoozed', 'Snoozed'),
    )

    medicine = models.ForeignKey(
        Medicine,
        on_delete=models.CASCADE,
        related_name='doses'
    )
    scheduled_time = models.DateTimeField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    taken_at = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.medicine.name} - {self.scheduled_time}"


class CaretakerRelationship(models.Model):
    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='caretaker_connections'
    )
    caretaker = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='patient_connections'
    )
    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.caretaker.username} → {self.patient.username}"