import logging
from typing import List, Dict, Any, Tuple
from app.pipeline.pdf_extractor import QuestionSchema

logger = logging.getLogger(__name__)

class ValidationError(Exception):
    pass

class DataValidator:
    def __init__(self):
        pass

    def validate_questions(self, questions: List[QuestionSchema]) -> Tuple[List[QuestionSchema], List[Dict[str, Any]]]:
        """
        Validates questions for logical consistency and correctness.
        Returns a tuple of (valid_questions, invalid_questions_with_errors)
        """
        valid = []
        invalid = []

        for idx, q in enumerate(questions):
            errors = []

            # 1. Must have exactly 4 options
            if len(q.options) != 4:
                errors.append(f"Expected 4 options, got {len(q.options)}")

            # 2. Options must have unique labels (like A, B, C, D)
            labels = [opt.label.strip().upper() for opt in q.options]
            if len(set(labels)) != len(labels):
                errors.append(f"Duplicate option labels found: {labels}")

            # 3. Required standard labels A, B, C, D are preferred but at least they should be unique
            expected_labels = {'A', 'B', 'C', 'D'}
            if set(labels) != expected_labels:
                logger.warning(f"Question {idx} has non-standard labels: {labels}")

            # 4. Correct option must match one of the option labels
            correct = q.correct_option.strip().upper()
            if correct not in labels:
                errors.append(f"Correct option '{q.correct_option}' not found in option labels: {labels}")

            # 5. Question text should not be empty
            if not q.question_text.strip():
                errors.append("Question text is empty")

            # Check length for sanity (too short usually means parsing error)
            if len(q.question_text.strip()) < 5:
                errors.append(f"Question text suspiciously short: '{q.question_text}'")

            if errors:
                invalid.append({
                    "question": q.model_dump() if hasattr(q, "model_dump") else q.dict(),
                    "errors": errors,
                    "index": idx
                })
                logger.error(f"Validation failed for question at index {idx}: {errors}")
            else:
                # Clean up data just in case
                q.correct_option = correct
                for opt in q.options:
                    opt.label = opt.label.strip().upper()
                valid.append(q)

        return valid, invalid

    def generate_report(self, valid: List[QuestionSchema], invalid: List[Dict[str, Any]]) -> str:
        """Generate a validation report summary"""
        total = len(valid) + len(invalid)
        success_rate = (len(valid) / total * 100) if total > 0 else 0

        report = []
        report.append("="*50)
        report.append("📝 DATA PIPELINE VALIDATION REPORT")
        report.append("="*50)
        report.append(f"Total Questions Processed: {total}")
        report.append(f"Valid Questions: {len(valid)}")
        report.append(f"Invalid Questions: {len(invalid)}")
        report.append(f"Success Rate: {success_rate:.1f}%")
        report.append("-" * 50)

        if invalid:
            report.append("❌ ERROR DETAILS:")
            for item in invalid[:10]: # Show up to 10 errors
                q_snippet = item['question'].get('question_text', '')[:50] + "..."
                report.append(f"Index {item['index']} | {q_snippet}")
                for err in item['errors']:
                    report.append(f"  - {err}")

            if len(invalid) > 10:
                report.append(f"... and {len(invalid) - 10} more errors.")

        report.append("="*50)
        return "\n".join(report)

