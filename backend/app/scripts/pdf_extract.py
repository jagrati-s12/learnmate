import os
import sys
import json
import asyncio
import traceback
from pathlib import Path
from dotenv import load_dotenv

# We need pymupdf for image rendering and google-generativeai for parsing
try:
    import pymupdf as fitz  # PyMuPDF
    import google.generativeai as genai
except ImportError:
    print("Missing requirements! Please run:")
    print("! source backend/venv/Scripts/activate && pip install pymupdf google-generativeai")
    sys.exit(1)

# Ensure the backend src is in path to import models if needed
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.append(backend_dir)

# Load .env from the backend directory
env_path = os.path.join(backend_dir, ".env")
load_dotenv(env_path)

# Setup Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print(f"CRITICAL: GEMINI_API_KEY is not set in {env_path}")
    sys.exit(1)

genai.configure(api_key=GEMINI_API_KEY)
# We use gemini-1.5-flash as it is extremely fast and capable of vision extraction
model = genai.GenerativeModel('gemini-1.5-flash-latest')

PROMPT = """
You are an expert educational content parser.
I will give you an image of a Question Paper page.
Extract all multiple-choice questions visible on this page.

Output purely a JSON array of objects with this exact structure:
[
  {
    "question_text": "Text of the question",
    "options": [
      {"label": "A", "text": "First option"},
      {"label": "B", "text": "Second option"},
      {"label": "C", "text": "Third option"},
      {"label": "D", "text": "Fourth option"}
    ],
    "correct_label": "A", // If it is visibly marked or indicated in the paper, otherwise null
    "explanation": "", // Any answer explanation provided, otherwise null
    "year": null,      // Extract if year metadata is present
    "marks": 1         // Default 1, extract if visible
  }
]
Do NOT return backticks or markdown, ONLY valid JSON. If there are no questions on the page, return [].
"""

async def extract_questions_from_page(image_path: str):
    try:
        sample_file = genai.upload_file(path=image_path)
        response = model.generate_content([sample_file, PROMPT])

        # Cleanup uploaded file immediately
        genai.delete_file(sample_file.name)

        text = response.text.strip()
        # Clean markdown if accidentally sent
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]

        data = json.loads(text.strip())
        return data
    except Exception as e:
        print(f"Error parsing {image_path}: {e}")
        return []

async def process_pdf(pdf_path: str, start_page: int, end_page: int, output_file: str):
    print(f"Opening PDF: {pdf_path}")
    doc = fitz.open(pdf_path)

    total_extracted = []

    # Ensure a local temp dir for images
    temp_dir = Path("temp_pdf_images")
    temp_dir.mkdir(exist_ok=True)

    # Restrict end_page to document bounds
    end_page = min(end_page, len(doc) - 1)

    for page_num in range(start_page, end_page + 1):
        print(f"Processing page {page_num}...")
        page = doc.load_page(page_num)

        # High resolution render
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
        img_path = temp_dir / f"page_{page_num}.png"
        pix.save(str(img_path))

        questions = await extract_questions_from_page(str(img_path))
        print(f"Extracted {len(questions)} questions from page {page_num}")
        total_extracted.extend(questions)

        # Clean up image
        if img_path.exists():
            img_path.unlink()

    doc.close()

    # Save output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(total_extracted, f, indent=2, ensure_ascii=False)

    print(f"\nSaved {len(total_extracted)} total questions to {output_file}")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Extract Questions from PDF pages.")
    parser.add_argument("pdf_path", type=str, help="Path to the PDF file")
    parser.add_argument("--start", type=int, default=0, help="Starting page index (0-based)")
    parser.add_argument("--end", type=int, default=1, help="Ending page index (0-based)")
    parser.add_argument("--out", type=str, default="extracted_questions.json", help="Output JSON file")

    args = parser.parse_args()

    asyncio.run(process_pdf(args.pdf_path, args.start, args.end, args.out))