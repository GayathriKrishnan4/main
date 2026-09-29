from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    PatientProfileViewSet,
    MedicineViewSet,
    MedicationDoseViewSet,
    CaretakerRelationshipViewSet,
)

from .auth_views import signup, login


router = DefaultRouter()

router.register(r'profiles', PatientProfileViewSet, basename='profiles')
router.register(r'medicines', MedicineViewSet, basename='medicines')
router.register(r'doses', MedicationDoseViewSet, basename='doses')
router.register(r'caretakers', CaretakerRelationshipViewSet, basename='caretakers')


urlpatterns = [
    path('signup/', signup),
    path('login/', login),
    path('', include(router.urls)),
]