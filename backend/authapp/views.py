# clients/views.py
from django.http import FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Max
from django.core.mail import send_mail
from django.conf import settings
from django.utils.dateparse import parse_datetime
from .models import ActivityLog, Client, Report
from .serializers import ActivityLogSerializer, BookingSerializer, ClientProfileSerializer, ClientRegistrationSerializer, EmployeeSimpleSerializer, ReportSerializer
import random
from datetime import date, timedelta
from rest_framework import generics, permissions
from .models import Booking
from .serializers import BookingSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN, HTTP_404_NOT_FOUND
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission

from rest_framework.permissions import AllowAny
def generate_otp():
    return str(random.randint(1000, 9999)).zfill(4)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def send_otp(request):
    serializer = ClientRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        otp = generate_otp()

        # Create or update client
        client, _ = Client.objects.update_or_create(
            email=data['email'],
            defaults={
                'name': data['name'],
                'phone': data['phone'],
                'otp': otp,
                'otp_created_at': timezone.now(),
                'is_verified': False
            }
        )

        send_mail(
            'Your OTP Code',
            f"Hi {data['name']}, your OTP is {otp}",
            settings.EMAIL_HOST_USER,
            [data['email']],
            fail_silently=False,
        )

        return Response({'message': 'OTP sent to email.'})
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    try:
        client = Client.objects.get(email=email)
    except Client.DoesNotExist:
        return Response({'error': 'Email not found'}, status=404)

    if client.is_verified:
        return Response({'message': 'Already verified'})

    if otp != client.otp:
        return Response({'error': 'Incorrect OTP'}, status=400)

    if timezone.now() > client.otp_created_at + timedelta(minutes=5):
        return Response({'error': 'OTP expired'}, status=400)

    if email.lower().startswith('admin') or email.lower().startswith('ygp'):
        return Response({'message': 'This email is reserved for employees. Contact admin.'}, status=403)

    client.is_verified = True
    client.otp = None
    client.otp_created_at = None
    client.save()

    return Response({'message': 'OTP verified. Proceed to signup.'})

@api_view(['POST'])
@permission_classes([AllowAny]) 
def resend_otp(request):
    email = request.data.get('email')

    try:
        client = Client.objects.get(email=email)
    except Client.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    if client.is_verified:
        return Response({'message': 'Already verified'})

    otp = generate_otp()
    client.otp = otp
    client.otp_created_at = timezone.now()
    client.save()

    send_mail(
        'Resent OTP Code',
        f'Hi {client.name}, your new OTP is {otp}',
        settings.EMAIL_HOST_USER,
        [client.email],
        fail_silently=False,
    )

    return Response({'message': 'OTP resent'})


from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

@api_view(['POST'])
@permission_classes([AllowAny]) 
def signup(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if email.lower().startswith('admin') or email.lower().startswith('ygp'):
        return Response({'error': 'Signup not allowed for this email. Contact admin.'}, status=403)

    try:
        client = Client.objects.get(email=email)

        if not client.is_verified:
            return Response({'message': 'Please verify your email first.'}, status=403)

        if client.user:
            return Response({'message': 'Account already exists. Please log in.'}, status=400)

        user = User.objects.create_user(username=email, email=email, password=password)
        client.user = user
        client.save()

        return Response({'message': 'Signup successful. You can now log in.'})
    except Client.DoesNotExist:
        return Response({'message': 'Please request OTP to begin registration.'}, status=404)

from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny]) 
def login(request):
    email = request.data.get('email', '').lower().strip()
    password = request.data.get('password')

    user = authenticate(username=email, password=password)

    if user:
        if not user.is_active:
            return Response({'error': 'User account is inactive.'}, status=403)

        try:
            if hasattr(user, 'client') and user.client.is_verified:
                refresh = RefreshToken.for_user(user)
                ActivityLog.objects.create(user=user, login_time=now())
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Client login successful.',
                    'user_type': 'client',
                    'role': 'client',
                    'user': {
                        'id': user.id,
                        'name': user.client.name,
                        'email': user.email,
                    }
                })

            elif hasattr(user, 'employee'):
                refresh = RefreshToken.for_user(user)
                ActivityLog.objects.create(user=user, login_time=now())
                role = user.employee.profession
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': f"Employee ({role}) login successful.",
                    'user_type': 'employee',
                    'role': role,
                    'user': {
                        'id': user.id,
                        'name': user.employee.name,
                        'email': user.email,
                    }
                })

            else:
                return Response({'error': 'Unknown user type.'}, status=403)

        except Exception as e:
            return Response({'error': str(e)}, status=500)

    return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        print("Received Refresh Token:", refresh_token)  # 👈 Add this for debugging

        token = RefreshToken(refresh_token)  # This will raise if token is invalid
        token.blacklist()

        user = request.user
        if user.is_authenticated:
            latest_log = ActivityLog.objects.filter(user=user, logout_time__isnull=True).last()
            if latest_log:
                latest_log.logout_time = now()
                latest_log.save()

        return Response({"message": "Logged out successfully."})
    except Exception as e:
        print("Logout error:", str(e))
        return Response({"error": "Invalid refresh token."}, status=400)


from rest_framework.permissions import IsAuthenticated
class BookingCreateView(generics.CreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        try:
            client = user.client  # This assumes every user has a linked Client
        except Client.DoesNotExist:
            client = None  # Optional: Or raise an error if this must exist

        serializer.save(user=user, client=client)

class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    client = request.user.client
    serializer = ClientProfileSerializer(client)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    client = request.user.client
    serializer = ClientProfileSerializer(client, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Profile updated successfully', 'profile': serializer.data})
    return Response(serializer.errors, status=400)

from rest_framework import viewsets, permissions
from .models import Employee
from .serializers import EmployeeSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        employee = self.get_object()
    
        if employee.user:
            employee.user.delete()
        else:
            employee.delete()
    
        return Response(status=204)



# views.py

from rest_framework import viewsets, status
from .models import Client, Task, Employee
from .serializers import ClientSerializer, TaskSerializer
from rest_framework.response import Response

class ClientViewSet(viewsets.GenericViewSet, viewsets.mixins.ListModelMixin):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Task, Booking, Employee
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def create(self, request, *args, **kwargs):
        try:
            booking = Booking.objects.get(id=request.data['booking_id'])
            manager = Employee.objects.get(id=request.data['manager_id'])

            # If task already exists, update it
            task, created = Task.objects.update_or_create(
                booking=booking,
                defaults={'manager': manager}
            )

            serializer = self.get_serializer(task)
            return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=404)
        except Employee.DoesNotExist:
            return Response({'error': 'Manager not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.select_related('manager').all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        print("Current user:", user)
        print("Employee:", getattr(user, 'employee', None))
        if user.employee.profession == 'social media manager':
    # Get all tasks assigned to this SMM
           return Booking.objects.filter(task__manager=user.employee).distinct()

        return Booking.objects.all()

    def perform_update(self, serializer):
        serializer.save()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def social_media_managers(request):
    managers = Employee.objects.filter(profession='social media manager')
    return Response([{'id': m.id, 'name': m.name} for m in managers])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quotation(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id)
        user = request.user

        # Get SMM (logged-in user must be linked to an Employee with role: social media manager)
        try:
            smm = Employee.objects.get(user=user, profession__iexact='social media manager')
        except Employee.DoesNotExist:
            smm = None

        # Construct quotation text
        quotation = f"""
📋 Booking ID: {booking.id}
📅 Service: {booking.service}
📌 Status: {booking.status}
📆 Booking Date: {booking.created_at.date()}
📍 Service Date: {booking.date}
🕒 Time: {booking.start_time} – {booking.end_time}

👤 Client: {booking.client.name if booking.client else 'N/A'}
📞 Phone: {booking.client.phone if booking.client else 'N/A'}
📧 Email: {booking.client.email if booking.client else 'N/A'}

📈 SMM: {smm.name if smm else 'N/A'}
📞 SMM Phone: {smm.phone if smm else 'N/A'}
📧 SMM Email: {smm.user.email if smm else 'N/A'}
"""

        booking.quotation_text = quotation
        booking.save()

        return Response({'message': 'Quotation generated', 'quotation': quotation})
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)

from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_employees(request):
    # Exclude employees with restricted roles
    excluded_roles = ['admin', 'finance manager', 'social media manager']

    employees = Employee.objects.exclude(
        Q(profession__iexact='admin') |
        Q(profession__iexact='finance manager') |
        Q(profession__iexact='social media manager')
    )

    serializer = EmployeeSimpleSerializer(employees, many=True)
    return Response(serializer.data)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def assign_employees_to_booking(request, booking_id):
    try:
        booking = Booking.objects.get(pk=booking_id)
    except Booking.DoesNotExist:
        return Response({"detail": "Booking not found"}, status=404)

    serializer = BookingSerializer(booking, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_reports(request):
    reports = Report.objects.filter(user=request.user).order_by('-uploaded_at')
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_report(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'error': 'No file uploaded.'}, status=400)

    report = Report.objects.create(
        user=request.user,
        file=file,
        name=file.name
    )
    serializer = ReportSerializer(report)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_report(request, report_id):
    try:
        report = Report.objects.get(pk=report_id)
        report.delete()
        return Response({'message': 'Report deleted successfully'})
    except Report.DoesNotExist:
        return Response({'error': 'Report not found'}, status=404)
    
from django.http import FileResponse, Http404
import os
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_report(request, report_id):
    try:
        report = Report.objects.get(pk=report_id, user=request.user)
        file_path = report.file.path  # FileField path

        if not os.path.exists(file_path):
            raise Http404("File does not exist")

        return FileResponse(
            open(file_path, 'rb'),
            as_attachment=True,
            filename=report.name  # Optional: custom download name
        )

    except Report.DoesNotExist:
        return Response({'error': 'Report not found'}, status=404)
from rest_framework.views import APIView
from .serializers import BookingSerializer

class AssignedBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            employee = Employee.objects.get(user=user)
        except Employee.DoesNotExist:
            return Response({"error": "Employee profile not found"}, status=404)

        # Get tasks where this employee is assigned
        tasks = Task.objects.filter(assigned_employees=employee).select_related('booking')

        # Extract bookings (linked via OneToOneField on task)
        bookings = [task.booking for task in tasks if task.booking]

        serializer = BookingSerializer(bookings, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_reports(request):
    reports = Report.objects.all().order_by('-uploaded_at')
    serializer = ReportSerializer(reports, many=True)
    return Response(serializer.data)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import ActivityLog, Client
from django.utils.timezone import now

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def client_summary_analytics(request):
    today = date.today()

    total_clients = Client.objects.count()

    clients_logged_in_today = ActivityLog.objects.filter(
        login_time__date=today, user__client__isnull=False
    ).values('user').distinct().count()

    clients_logged_out_today = ActivityLog.objects.filter(
        logout_time__date=today, user__client__isnull=False
    ).values('user').distinct().count()

    active_clients = ActivityLog.objects.filter(
        user__client__isnull=False
    ).values('user').distinct().count()

    # 👇 Project stats
    active_projects = Booking.objects.exclude(status="Delivered").count()
    inactive_projects = Booking.objects.filter(status="Delivered").count()

    # 👇 Optional: deduplicated client logins
    activity_logs = ActivityLog.objects.filter(
        user__client__isnull=False
    ).select_related("user", "user__client").order_by('-login_time')

    seen_users = set()
    unique_logs = []
    for log in activity_logs:
        if log.user.id not in seen_users:
            seen_users.add(log.user.id)
            unique_logs.append(log)

    client_logins = []
    for log in unique_logs:
        # ✅ Get latest booking for the user (if exists)
        latest_booking = Booking.objects.filter(user=log.user).order_by('-created_at').first()
        service = latest_booking.service if latest_booking else None

        client_logins.append({
            "email": log.user.email,
            "login_time": log.login_time,
            "logout_time": log.logout_time,
            "service": service
        })

    data = {
        "total_clients": total_clients,
        "active_clients": active_clients,
        "logged_in_today": clients_logged_in_today,
        "logged_out_today": clients_logged_out_today,
        "active_projects": active_projects,
        "inactive_projects": inactive_projects,
        "client_logins": client_logins,
    }

    return Response(data)


class ActivityLogView(APIView):
    def get(self, request):
        logs = ActivityLog.objects.select_related('user').order_by('-login_time')
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)
    
from django.db.models import Count

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_profession_stats(request):
    profession_counts = Employee.objects.values('profession').annotate(count=Count('id'))

    return Response({"profession_counts": profession_counts})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bookings_by_profession(request):
    # Prefetch task, manager, and assigned_employees for optimization
    bookings = Booking.objects.select_related("task__manager").prefetch_related("task__assigned_employees")

    profession_counts = {}

    for booking in bookings:
        task = getattr(booking, 'task', None)
        if task:
            # Include task manager's profession
            manager = task.manager
            if manager:
                profession = manager.profession or "Unknown"
                profession_counts[profession] = profession_counts.get(profession, 0) + 1

            # Include assigned_employees professions
            for emp in task.assigned_employees.all():
                profession = emp.profession or "Unknown"
                profession_counts[profession] = profession_counts.get(profession, 0) + 1

    result = [
        {"profession": profession, "booking_count": count}
        for profession, count in profession_counts.items()
    ]

    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_activity_logs(request):
    logs = ActivityLog.objects.filter(user__employee__isnull=False).select_related("user", "user__employee").order_by("-login_time")

    seen_users = set()
    unique_logs = []
    for log in logs:
        if log.user.id not in seen_users:
            seen_users.add(log.user.id)
            unique_logs.append(log)

    data = [
        {
            "email": log.user.email,
            "login_time": log.login_time,
            "logout_time": log.logout_time,
            "profession": log.user.employee.profession
        }
        for log in unique_logs
    ]
    return Response(data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def task_summary_analytics(request):
    user = request.user
    employee = getattr(user, 'employee', None)
    
    if not employee:
        return Response({'error': 'User is not an employee'}, status=403)

    # Tasks assigned to this employee
    tasks = Task.objects.filter(assigned_employees=employee)

    # Bar Chart Data: Count per day (last 7 days)
    start_date = now().date() - timedelta(days=6)
    task_counts = (
        tasks
        .filter(created_at__date__gte=start_date)
        .values('created_at__date')
        .annotate(works=Count('id'))
        .order_by('created_at__date')
    )
    bar_data = [{'date': item['created_at__date'].strftime('%Y-%m-%d'), 'works': item['works']} for item in task_counts]

    # Pie Chart Data: Completed vs Pending
    completed = tasks.filter(completed_employees=employee).count()
    total = tasks.count()
    pie_data = [
        {'name': 'Completed', 'value': completed},
        {'name': 'Pending', 'value': total - completed}
    ]

    return Response({
        'bar_data': bar_data,
        'pie_data': pie_data
    })
