# clients/serializers.py
from rest_framework import serializers
from .models import ActivityLog, Booking, Client, Employee, Report
from django.contrib.auth.models import User
class ClientRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['name', 'email', 'phone']

class EmployeeSimpleSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.first_name')
    profession = serializers.CharField()
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField()


    class Meta:
        model = Employee
        fields = ['id', 'name', 'profession', 'email', 'phone']



class ClientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['name', 'email', 'phone', 'address', 'city', 'state']
        read_only_fields = ['email']  # Prevent updating email if you want

class BookingSerializer(serializers.ModelSerializer):
    manager = EmployeeSimpleSerializer(read_only=True)
    client = ClientProfileSerializer(read_only=True)
   
    manager_id = serializers.IntegerField(source='manager.id', allow_null=True, required=False)
    manager_name = serializers.SerializerMethodField()
    manager_email = serializers.SerializerMethodField()
    manager_phone = serializers.SerializerMethodField()

    email = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    date_only = serializers.SerializerMethodField()
    client_name = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    service = serializers.CharField(required=False, allow_blank=True)
    assigned_employees = serializers.SerializerMethodField()
    assigned_employee_ids = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'date', 'hours', 'num_people', 'entire_day', 'date_only',
            'created_at', 'service', 'status',
            'manager_id', 'manager', 'manager_name', 'manager_email', 'manager_phone',
            'email', 'phone', 'start_time', 'end_time', 'quotation_text',
            'instructions', 'rating', 'client', 'total_cost', 'client_name', 'address',
            'assigned_employees', 'assigned_employee_ids'
        ]
        read_only_fields = ('id', 'quotation_text', 'total_cost')
        extra_kwargs = {
    'user': {'required': False, 'write_only': True},
    'client': {'required': False, 'write_only': True},
}


    def update(self, instance, validated_data):
        manager_data = validated_data.pop('manager', None)
        if manager_data and 'id' in manager_data:
            instance.manager_id = manager_data['id']

        assigned_ids = validated_data.pop('assigned_employee_ids', None)
        instance = super().update(instance, validated_data)

        task, _ = Task.objects.get_or_create(booking=instance)

        if assigned_ids is not None:
            task.assigned_employees.set(assigned_ids)
            task.save()

        return instance

    # 🧠 Helper functions for manager and client details
    def get_manager_name(self, obj):
        return getattr(obj.task.manager.user, 'first_name', None) if hasattr(obj, 'task') and obj.task.manager else None

    def get_manager_email(self, obj):
        return getattr(obj.task.manager.user, 'email', None) if hasattr(obj, 'task') and obj.task.manager else None

    def get_manager_phone(self, obj):
        return getattr(obj.task.manager, 'phone', None) if hasattr(obj, 'task') and obj.task.manager else None

    def get_email(self, obj):
        return getattr(obj.user, 'email', None)

    def get_phone(self, obj):
        return getattr(obj.client, 'phone', None)

    def get_client_name(self, obj):
        return getattr(obj.client, 'name', None)

    def get_address(self, obj):
        return getattr(obj.client, 'address', None)

    def get_date_only(self, obj):
        return obj.created_at.date()

    def get_assigned_employees(self, obj):
        task = getattr(obj, 'task', None)
        if task:
            return EmployeeSimpleSerializer(task.assigned_employees.all(), many=True).data
        return []

    def get_assigned_employee_ids(self, obj):
        return list(obj.task.assigned_employees.values_list('id', flat=True)) if hasattr(obj, 'task') else []

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Employee

class EmployeeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.first_name')
    email = serializers.EmailField(source='user.email')
    password = serializers.CharField(source='user.password', write_only=True, required=False)

    class Meta:
        model = Employee
        fields = ['id', 'name', 'email', 'password', 'phone', 'address', 'profession', 'salary']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        name = user_data.get('first_name')
        email = user_data.get('email')
        password = user_data.get('password', None)

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=name,
            password=password or User.objects.make_random_password()
        )

        employee = Employee.objects.create(user=user, name=name, email=email, **validated_data)
        return employee

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        if 'first_name' in user_data:
            instance.user.first_name = user_data['first_name']
        if 'email' in user_data:
            instance.user.email = user_data['email']
            instance.user.username = user_data['email']
        instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance
# serializers.py

from rest_framework import serializers
from .models import Client, Task
from .models import Employee

class TaskSerializer(serializers.ModelSerializer):
    booking_id = serializers.CharField()
    manager_id = serializers.IntegerField()
    assigned_employees = EmployeeSimpleSerializer(many=True, read_only=True)
    assigned_employee_ids = serializers.PrimaryKeyRelatedField(
    queryset=Employee.objects.exclude(profession__in=[
        'admin', 'finance manager', 'social media manager'
    ]),
    source='assigned_employees',
    many=True
)
    class Meta:
        model = Task
        fields = ['id', 'booking_id', 'manager_id', 'manager','created_at','assigned_employee_ids','assigned_employees']
        read_only_fields = ['id', 'created_at']
    
def create(self, validated_data):
        booking_id = validated_data.pop('booking_id')
        manager_id = validated_data.pop('manager_id')
        booking = Booking.objects.get(id=booking_id)
        manager = Employee.objects.get(id=manager_id)
        return Task.objects.create(booking=booking, manager=manager, **validated_data)


class ClientSerializer(serializers.ModelSerializer):
    assigned_manager = serializers.SerializerMethodField()
    task_id = serializers.SerializerMethodField()
   
    class Meta:
        model = Client
        fields = ['id', 'name', 'email', 'address', 'city', 'state', 'assigned_manager', 'task_id']

    def get_assigned_manager(self, obj):
        task = getattr(obj, 'tasks', None).first()
        if task:
            return {
                'id': task.manager.id,
                'name': task.manager.user.first_name,
            }
        return None

    def get_task_id(self, obj):
        task = getattr(obj, 'tasks', None).first()
        return task.id if task else None

class ReportSerializer(serializers.ModelSerializer):
    uploadedAt = serializers.DateTimeField(source='uploaded_at', format="%Y-%m-%d", read_only=True)
    data = serializers.FileField(source='file', read_only=True)

    class Meta:
        model = Report
        fields = ['id', 'name', 'uploadedAt', 'data']

    def get_uploadedAt(self, obj):
        return obj.uploaded_at.strftime('%Y-%m-%d')

class ActivityLogSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = ActivityLog
        fields = ['email', 'login_time', 'logout_time']