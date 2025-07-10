from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, ReviewViewSet, LibraryUserViewSet, RentalViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'users', LibraryUserViewSet)
router.register(r'rentals', RentalViewSet)

urlpatterns = [
    path('', include(router.urls)),
]