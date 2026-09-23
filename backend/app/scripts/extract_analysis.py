import pdfplumber
import json
import os

pdf_path = r"C:\Users\sjagr\Documents\vscode\learnmate\SSC JE EXAM ANALYSIS.pdf"

print(f"Reading PDF: {pdf_path}")
text_data = []

if not os.path.exists(pdf_path):
    print("PDF NOT FOUND")
else:
    with pdfplumber.open(pdf_path) as pdf:
        # Let's extract first few pages to see the structure
        for i, page in enumerate(pdf.pages[:10]):
            text = page.extract_text()
            text_data.append(f"--- PAGE {i+1} ---")
            text_data.append(text or "")
        
    print("\n".join(text_data))
