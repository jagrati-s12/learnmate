import pytest
from app.pipeline.pdf_extractor import QuestionSchema, OptionSchema
from app.pipeline.validator import DataValidator
from app.pipeline.importer import DatabaseImporter

def test_validator_valid_question():
    validator = DataValidator()
    valid_q = QuestionSchema(
        question_text="What is 2+2?",
        options=[
            OptionSchema(label="A", text="3"),
            OptionSchema(label="B", text="4"),
            OptionSchema(label="C", text="5"),
            OptionSchema(label="D", text="6"),
        ],
        correct_option="B"
    )

    valid, invalid = validator.validate_questions([valid_q])

    assert len(valid) == 1
    assert len(invalid) == 0
    assert valid[0].correct_option == "B"

def test_validator_invalid_options_count():
    validator = DataValidator()
    invalid_q = QuestionSchema(
        question_text="What is 2+2?",
        options=[
            OptionSchema(label="A", text="3"),
            OptionSchema(label="B", text="4"),
            OptionSchema(label="C", text="5"),
        ],
        correct_option="B"
    )

    valid, invalid = validator.validate_questions([invalid_q])

    assert len(valid) == 0
    assert len(invalid) == 1
    assert "Expected 4 options, got 3" in invalid[0]["errors"]

def test_validator_invalid_correct_option():
    validator = DataValidator()
    invalid_q = QuestionSchema(
        question_text="What is 2+2?",
        options=[
            OptionSchema(label="A", text="3"),
            OptionSchema(label="B", text="4"),
            OptionSchema(label="C", text="5"),
            OptionSchema(label="D", text="6"),
        ],
        correct_option="E"
    )

    valid, invalid = validator.validate_questions([invalid_q])

    assert len(valid) == 0
    assert len(invalid) == 1
    assert "not found in option labels" in invalid[0]["errors"][0]

def test_validator_empty_question_text():
    validator = DataValidator()
    invalid_q = QuestionSchema(
        question_text="",
        options=[
            OptionSchema(label="A", text="3"),
            OptionSchema(label="B", text="4"),
            OptionSchema(label="C", text="5"),
            OptionSchema(label="D", text="6"),
        ],
        correct_option="B"
    )

    valid, invalid = validator.validate_questions([invalid_q])

    assert len(valid) == 0
    assert len(invalid) == 1
    assert "Question text is empty" in invalid[0]["errors"]
