
# Create your views here.
import json
from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from .models import Document
from django.views.decorators.csrf import csrf_exempt
from .ai.document_loader import load_and_split
from .ai.embeddings import get_embeddings
from core.ai.vector_store import save_vectors
from .ai.rag_pipeline import ask
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
import os
import tempfile

@csrf_exempt
def upload_document(request):
    if request.method == 'POST':
        try:
            file = request.FILES.get('file')
            if not file:
                return HttpResponse("No file uploaded", status=400)

            doc = Document.objects.create(file=file)

            if not os.path.exists(doc.file.path):
                return HttpResponse("File not saved correctly", status=500)

            docs = load_and_split(doc.file.path)

            if not docs:
                return HttpResponse("PDF is empty or unreadable", status=400)

            embeddings = get_embeddings()
            print("Reached save_vectors")
            save_vectors(docs, embeddings)

            return render(request, 'chat.html')

        except Exception as e:
            print("UPLOAD ERROR:", str(e))
            return HttpResponse("Internal error while processing document", status=500)

    return render(request, 'upload.html')

def chat_page(request):
    return render(request, 'chat.html')

def ask_question(request):
    if request.method == "POST":
        data = json.loads(request.body)
        result = ask(data["question"])

        return JsonResponse({
            "answer": result["answer"]
        })
