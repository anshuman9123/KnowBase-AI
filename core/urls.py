from django.urls import path
from . import views

urlpatterns = [
    path("", views.upload_document, name="upload"),
    path("chat/", views.chat_page, name="chat"),
    path("ask/", views.ask_question, name="ask"),
]