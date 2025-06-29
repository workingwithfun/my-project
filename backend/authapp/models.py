from django.conf import settings
from django.contrib.auth.models import User
from django.db import models

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    otp = models.CharField(max_length=4, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    def __str__(self):
        return self.email

from django.utils.timezone import now
class Booking(models.Model):
    client = models.ForeignKey(Client, null=True, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    id = models.CharField(primary_key=True, max_length=20, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    service = models.CharField(max_length=100, default='general')
    status = models.CharField(max_length=50, default='service booked')
    date = models.DateField()
    hours = models.IntegerField(null=True, blank=True)
    num_people = models.IntegerField(null=True, blank=True)
    entire_day = models.BooleanField(default=False)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)
    quotation_text = models.TextField(blank=True, null=True)
    instructions = models.TextField(blank=True, null=True)
    total_cost = models.DecimalField(
    max_digits=10, decimal_places=2, null=True, blank=True
)
    rating = models.PositiveSmallIntegerField(blank=True, null=True, help_text="Rating out of 5")
    manager = models.ForeignKey(
        'Employee', null=True, blank=True, on_delete=models.SET_NULL,
        limit_choices_to={'profession': 'social media manager'},
        related_name='assigned_bookings'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            year = now().year
            count = Booking.objects.filter(created_at__year=year).count() + 1
            self.id = f"{year}{count:04d}"  # e.g., 20250001
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.id} by {self.user.username} on {self.date}"
    

class Employee(models.Model):
    ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('social media manager', 'Social Media Manager'),
    ('photographer', 'Photographer'),
    ('videographer', 'Videographer'),
    ('photo editor', 'Photo Editor'),
    ('video editor', 'Video Editor'),
    ('graphic designer', 'Graphic Designer'),
    ('finance manager', 'Finance Manager'),
]
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, unique=True)
    address = models.TextField(blank=True, null=True)
    email = models.EmailField(unique=True)
    profession = models.CharField(max_length=50, choices=ROLE_CHOICES)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.profession})"
    

# models.py

# models.py
class Task(models.Model):
    booking = models.OneToOneField(
    Booking,
    on_delete=models.CASCADE,
    related_name='task',
    null=True,  # <-- add this
    blank=True  # <-- optional: allows blank in forms
)
    completed_employees = models.ManyToManyField(Employee, related_name='completed_tasks', blank=True)  # ✅ Add this
    manager = models.ForeignKey(Employee, limit_choices_to={'profession': 'social media manager'}, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    assigned_employees = models.ManyToManyField(
        Employee,
        related_name='tasks',
        blank=True
    )
    def __str__(self):
        return f"{self.booking.id} → {self.manager.name}"


class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    file = models.FileField(upload_to='reports/')
    name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

# models.py
class ActivityLog(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    logout_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - Login: {self.login_time}, Logout: {self.logout_time}"
