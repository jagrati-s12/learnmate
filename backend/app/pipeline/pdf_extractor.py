import json
import logging
import re
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

import google.generativeai as genai
from app.config import settings

# Attempt to import pdfplumber, with fallback warning
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

logger = logging.getLogger(__name__)

class OptionSchema(BaseModel):
    label: str = Field(description="A, B, C, or D")
    text: str = Field(description="The text content of the option")

class QuestionSchema(BaseModel):
    question_text: str = Field(description="The question prompt")
    options: List[OptionSchema] = Field(description="Exactly 4 options")
    correct_option: str = Field(description="The label of the correct option")
    explanation: Optional[str] = Field(None, description="Explanation if available")
    is_pyq: bool = Field(True, description="Always true for PYQs")
    year: Optional[int] = Field(None, description="Year of the PYQ if known")
    shift: Optional[str] = Field(None, description="Shift (e.g. 'Morning', 'Evening')")
    source: Optional[str] = Field(None, description="Source context, e.g. 'SSC JE Civil'")
    marks: int = Field(1, description="Always 1 for SSC JE typical questions")
    difficulty: str = Field("medium", description="easy, medium, or hard")

class ExtractionResult(BaseModel):
    questions: List[QuestionSchema]

class PDFParserPipeline:
    def __init__(self, api_key: str = None):
        key = api_key or (settings.GEMINI_API_KEY if hasattr(settings, 'GEMINI_API_KEY') else getattr(settings, 'API_KEY', None))
        if key:
            genai.configure(api_key=key)
            self.model = genai.GenerativeModel('gemini-1.5-flash-latest')
        else:
            self.model = None
            logger.warning("No Gemini API key provided. LLM extraction will fail.")

    def extract_text(self, pdf_path: str) -> str:
        """Extract raw text using pdfplumber."""
        if not pdfplumber:
            raise ImportError("pdfplumber is not installed. Please run `pip install pdfplumber`.")

        full_text = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text.append(text)
        return "\n".join(full_text)

    def parse_with_llm(self, raw_text: str, metadata: Dict[str, Any] = None) -> List[QuestionSchema]:
        """Send raw text chunks to Gemini to structure into question objects."""
        if not self.model:
            raise Exception("Gemini API not configured.")

        # Chunk text into ~3000 characterize to avoid overwhelming the model prompt limits
        # and memory. Simple chunking for demonstration:
        chunks = [raw_text[i:i+4000] for i in range(0, len(raw_text), 4000)]
        all_questions = []

        prompt_template = """
You are an expert AI parser. Extract all multiple-choice questions from the provided text.
Return the output ONLY as valid JSON matching the following structure:
{
    "questions": [
        {
            "question_text": "text",
            "options": [{"label": "A", "text": "text"}, ...],
            "correct_option": "A",
            "explanation": "text or null",
            "is_pyq": true,
            "year": 2023,
            "shift": "Morning",
            "source": "SSC JE",
            "marks": 1,
            "difficulty": "medium"
        }
    ]
}

Inject the metadata provided below into every question object if year/shift/source is not explicitly mentioned, unless the text clearly specifies differently. Keep options strictly A, B, C, D.

Metadata: {metadata}

Raw Text:
{text}
"""

        for chunk_idx, chunk in enumerate(chunks):
            if not chunk.strip():
                continue

            prompt = prompt_template.format(metadata=json.dumps(metadata or {}), text=chunk)

            try:
                response = self.model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        response_mime_type="application/json",
                    )
                )

                response_text = response.text
                data = json.loads(response_text)
                parsed = ExtractionResult(**data)
                all_questions.extend(parsed.questions)
                logger.info(f"Chunk {chunk_idx+1}: Extracted {len(parsed.questions)} questions.")

            except Exception as e:
                logger.error(f"Failed to parse chunk {chunk_idx+1}: {e}")

        # Post-validation (remove duplicates)
        return self._clean_and_deduplicate(all_questions)

    def _clean_and_deduplicate(self, questions: List[QuestionSchema]) -> List[QuestionSchema]:
        unique_questions = []
        seen = set()
        for q in questions:
            # Simple deduplication by question text
            normalized_q = re.sub(r'[^a-zA-Z0-9]', '', q.question_text.lower())
            if normalized_q not in seen:
                seen.add(normalized_q)
                unique_questions.append(q)
        return unique_questions

    def process_pdf(self, pdf_path: str, metadata: Dict[str, Any] = None) -> List[QuestionSchema]:
        """Full pipeline: extract, parse, validate."""
        logger.info(f"Starting pipeline for {pdf_path}")
        text = self.extract_text(pdf_path)
        logger.info(f"Extracted {len(text)} characters.")
        questions = self.parse_with_llm(text, metadata)
        logger.info(f"Pipeline completed: {len(questions)} distinct questions extracted.")
        return questions

