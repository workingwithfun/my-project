from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.utils.timezone import now
from .models import ActivityLog

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    ActivityLog.objects.create(user=user)

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    latest_log = ActivityLog.objects.filter(user=user, logout_time__isnull=True).last()
    if latest_log:
        latest_log.logout_time = now()
        latest_log.save()
