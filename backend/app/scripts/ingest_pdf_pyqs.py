import pdfplumber
import json
import re

def extract_questions_from_pdf(pdf_path, output_json_path):
    print(f"Extracting PYQs from {pdf_path}...")
    questions = []
    
    with pdfplumber.open(pdf_path) as pdf:
        text_buffer = ""
        # Read the first set of pages just for parsing POC
        for page in pdf.pages[:30]: 
            text = page.extract_text()
            if text:
                text_buffer += text + "\n"
                
    # A simple regex pattern for SSC type layouts: "1. What is concrete?" "(a) A (b) B (c) C (d) D"
    # This is a naive POC parser, usually requires fine-tuning depending on the exact PDF layout.
    question_blocks = re.split(r'\n(?=\d+\.\s)', text_buffer)
    
    for block in question_blocks:
        block = block.strip()
        if not block or not re.match(r'^\d+\.', block):
            continue
            
        lines = block.split('\n')
        # Try to find options (a), (b), (c), (d)
        q_text = ""
        opts = []
        for line in lines:
            line = line.strip()
            # If line contains option letters like (A) or (a)
            if re.match(r'^\([a-dA-D]\)', line):
                opts.append(line)
            elif "(a)" in line.lower() and "(b)" in line.lower(): 
                # Inline options
                opts.append(line)
            else:
                q_text += " " + line
                
        questions.append({
            "raw_text": q_text.strip(),
            "raw_options": opts
        })
        
    print(f"Extracted {len(questions)} potential questions.")
    
    with open(output_json_path, 'w', encoding='utf-8') as f:
         json.dump(questions, f, indent=4)
         
    print(f"Saved to {output_json_path}")


if __name__ == "__main__":
    pdf_path = r"C:\Users\sjagr\Documents\vscode\learnmate\SSC JE CIVIL SOLVED PAPERS BOOK.pdf"
    extract_questions_from_pdf(pdf_path, "extracted_pyqs.json")

