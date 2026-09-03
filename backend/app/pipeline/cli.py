import argparse
import sys
import os
import json
import logging
from typing import Dict, Any

# Ensure we can import app modules when run directly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from app.database import SessionLocal
from app.pipeline.pdf_extractor import PDFParserPipeline, QuestionSchema
from app.pipeline.validator import DataValidator
from app.pipeline.importer import DatabaseImporter

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description="LearnMate PYQ Pipeline CLI")
    parser.add_argument("pdf_path", type=str, help="Path to the PDF file to process.")
    parser.add_argument("--topic-id", type=int, required=True, help="ID of the topic these questions belong to.")
    parser.add_argument("--year", type=int, help="Default year for the PYQs.")
    parser.add_argument("--shift", type=str, help="Default shift for the PYQs.")
    parser.add_argument("--source", type=str, default="SSC JE", help="Default source (e.g. SSC JE).")
    parser.add_argument("--dry-run", action="store_true", help="Do not save to database, just show validation.")
    parser.add_argument("--api-key", type=str, help="Gemini API Key (overrides env var).")

    args = parser.parse_args()

    if not os.path.exists(args.pdf_path):
        logger.error(f"File not found: {args.pdf_path}")
        sys.exit(1)

    metadata = {
        "year": args.year,
        "shift": args.shift,
        "source": args.source
    }

    # 1. Initialize Pipeline
    pipeline = PDFParserPipeline(api_key=args.api_key)

    # 2. Extract and Parse
    logger.info("Extracting and parsing PDF...")
    try:
        raw_questions = pipeline.process_pdf(args.pdf_path, metadata)
    except Exception as e:
        logger.error(f"Pipeline parsing failed: {e}")
        sys.exit(1)

    if not raw_questions:
        logger.warning("No questions extracted.")
        sys.exit(0)

    # 3. Validate
    logger.info("Validating parsed questions...")
    validator = DataValidator()
    valid_qs, invalid_qs = validator.validate_questions(raw_questions)

    report = validator.generate_report(valid_qs, invalid_qs)
    print(report)

    # 4. Import
    if valid_qs:
        if args.dry_run:
            logger.info("DRY RUN: Terminating before DB import. Sample parsed valid question:")
            print(json.dumps(valid_qs[0].dict(), indent=2))
        else:
            db = SessionLocal()
            try:
                importer = DatabaseImporter(db)
                logger.info("Importing into database...")
                stats = importer.import_questions(valid_qs, topic_id=args.topic_id, dry_run=False)

                print("\n✅ DB Import Stats:")
                for k, v in stats.items():
                    print(f"  - {k}: {v}")
            finally:
                db.close()
    else:
        logger.error("No valid questions to import.")

if __name__ == "__main__":
    main()
