# clients/urls.py
from django.urls import path

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ActivityLogView, AssignedBookingsView, BookingViewSet, ClientViewSet, EmployeeViewSet, TaskViewSet, client_summary_analytics, delete_report, download_report, generate_quotation, get_all_reports, get_user_reports, logout_view, social_media_managers, upload_report
from .views import send_otp, verify_otp, resend_otp,signup,login, BookingCreateView, MyBookingsView,get_profile, update_profile
from .views import (
    employee_profession_stats,
    bookings_by_profession,
    employee_activity_logs, task_summary_analytics
)

router = DefaultRouter()
router.register('employees', EmployeeViewSet, basename='employee')
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'bookings', BookingViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)), 
    path('register/', send_otp),
    path('verify-otp/', verify_otp),
    path('resend-otp/',resend_otp),
    path('signup/', signup, name='signup'),
    path('login/',login, name='login'),
    path('logout/',logout_view, name='login'),
    path('book/', BookingCreateView.as_view(), name='create-booking'),
    path('my-bookings/', MyBookingsView.as_view(), name='my-bookings'),
    path('profile/', get_profile),
    path('profile/update/', update_profile),
    path('social-media-managers/', social_media_managers),
    path('generate-quotation/<str:booking_id>/', generate_quotation),
    path('reports/', get_user_reports),
    path('reports/all/', get_all_reports),
    path('reports/upload/', upload_report),
    path('reports/<int:report_id>/', delete_report),
    path('assigned-bookings/', AssignedBookingsView.as_view(), name='assigned-bookings'),
    path('analytics/client-summary/', client_summary_analytics, name='client-summary'),
    path('activity-logs/', ActivityLogView.as_view()),
    path('employee/profession-stats/', employee_profession_stats, name='employee-profession-stats'),
    path('my-bookings/by-profession/', bookings_by_profession, name='bookings-by-profession'),
    path('employee/activity-logs/', employee_activity_logs, name='employee-activity-logs'),
    path('reports/download/<int:report_id>/', download_report),
    path('analytics/task-summary/', task_summary_analytics, name='task-summary'),
    
 
]