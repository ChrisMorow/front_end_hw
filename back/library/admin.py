from django.contrib import admin
from .models import Book, Review, Rental, LibraryUser

# Register your models here.
admin.site.register(Book)
admin.site.register(Review)
admin.site.register(Rental)
admin.site.register(LibraryUser)
