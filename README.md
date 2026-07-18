# KnowBase AI

KnowBase AI is a Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and ask questions based on their content. The application retrieves relevant information from the uploaded document using FAISS and generates answers with an LLM.

---

## Features

- Upload PDF documents
- Extract text from PDFs
- Split documents into chunks
- Generate vector embeddings
- Store embeddings using FAISS
- Semantic search over uploaded documents
- AI-generated answers based on retrieved context

---

## Tech Stack

### Backend
- Python
- Django
- LangChain
- FAISS
- OpenAI API
- PyMuPDF

### Frontend
- HTML
- CSS
- JavaScript

---

## Project Structure

```
KnowBase-AI/
│
├── core/
├── knowbase_ai/
├── static/
├── templates/
├── data/
├── manage.py
├── requirements.txt
└── .gitignore
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/anshuman9123/KnowBase-AI.git
```

### Move to the project directory

```bash
cd KnowBase-AI
```

### Create a virtual environment

```bash
python -m venv venv
```

### Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**macOS / Linux**

```bash
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Add Environment Variables

Create a `.env` file and add your API key.

```env
OPENAI_API_KEY=your_api_key
```

### Run the project

```bash
python manage.py runserver
```

Open your browser:

```
http://127.0.0.1:8000/
```

---

## How It Works

1. Upload a PDF document.
2. The document text is extracted using PyMuPDF.
3. The text is split into smaller chunks.
4. Embeddings are generated for each chunk.
5. FAISS stores the embeddings.
6. When a question is asked, relevant chunks are retrieved.
7. The retrieved context is sent to the LLM to generate an answer.

---

## Future Improvements

- Support multiple document uploads
- Improve the user interface
- Add conversation history
- Support more document formats

---

## Author

**Anshuman Kumar**

GitHub: https://github.com/anshuman9123