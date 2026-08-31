# Database Schema Design

## Overview

The LearnMate AI database follows a hierarchical structure that supports scalability and flexibility.

## Entity Relationship Diagram

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ├─────────────────┐
       │                 │
       ↓                 ↓
┌─────────────┐   ┌─────────────┐
│   Attempt   │   │  Bookmark   │
└──────┬──────┘   └──────┬──────┘
       │                 │
       │                 │
       └────────┬────────┘
                ↓
         ┌─────────────┐
         │  Question   │
         └──────┬──────┘
                │
                ↓
         ┌─────────────┐
         │    Topic    │
         └──────┬──────┘
                │
                ↓
         ┌─────────────┐
         │   Chapter   │
         └──────┬──────┘
                │
                ↓
         ┌─────────────┐
         │   Subject   │
         └──────┬──────┘
                │
                ↓
         ┌─────────────┐
         │   Branch    │
         └──────┬──────┘
                │
                ↓
         ┌─────────────┐
         │    Exam     │
         └─────────────┘
```

## Core Entities

### User
- `id` (PK, UUID)
- `email` (unique, indexed)
- `hashed_password`
- `full_name`
- `role` (student/admin)
- `is_active`
- `created_at`
- `updated_at`

### Exam
- `id` (PK, UUID)
- `name` (e.g., "SSC JE")
- `description`
- `is_active`
- `created_at`

### Branch
- `id` (PK, UUID)
- `exam_id` (FK → Exam)
- `name` (e.g., "Civil Engineering")
- `description`
- `is_active`

### Subject
- `id` (PK, UUID)
- `branch_id` (FK → Branch)
- `name` (e.g., "Structural Engineering")
- `description`
- `order_index`

### Chapter
- `id` (PK, UUID)
- `subject_id` (FK → Subject)
- `name`
- `description`
- `order_index`

### Topic
- `id` (PK, UUID)
- `chapter_id` (FK → Chapter)
- `name`
- `description`
- `order_index`

### Question
- `id` (PK, UUID)
- `topic_id` (FK → Topic)
- `question_text`
- `option_a`
- `option_b`
- `option_c`
- `option_d`
- `correct_option` (a/b/c/d)
- `explanation`
- `year` (exam year)
- `shift` (if applicable)
- `difficulty` (easy/medium/hard)
- `is_pyq` (boolean)
- `created_at`
- `updated_at`

### Test
- `id` (PK, UUID)
- `name`
- `description`
- `duration_minutes`
- `total_marks`
- `is_active`
- `created_at`

### TestQuestion (junction table)
- `id` (PK, UUID)
- `test_id` (FK → Test)
- `question_id` (FK → Question)
- `marks`
- `order_index`

### Attempt
- `id` (PK, UUID)
- `user_id` (FK → User)
- `test_id` (FK → Test, nullable for practice)
- `question_id` (FK → Question)
- `selected_option` (a/b/c/d/null)
- `is_correct`
- `time_taken_seconds`
- `attempt_type` (practice/test)
- `created_at`

### TestAttempt (test session)
- `id` (PK, UUID)
- `user_id` (FK → User)
- `test_id` (FK → Test)
- `start_time`
- `end_time`
- `total_correct`
- `total_incorrect`
- `total_unattempted`
- `score`
- `percentage`
- `is_completed`

### Bookmark
- `id` (PK, UUID)
- `user_id` (FK → User)
- `question_id` (FK → Question)
- `created_at`
- Unique constraint on (user_id, question_id)

## Indexes

Key indexes for performance:
- User: email (unique)
- Question: topic_id, year, is_pyq
- Attempt: user_id, question_id, created_at
- Bookmark: user_id, question_id
- TestAttempt: user_id, test_id, created_at

## Future Considerations

Fields that may be added later:
- Question: `tags`, `competency_level`, `cognitive_level`
- Attempt: `confidence_level`, `mistake_type`
- User: `learning_profile`, `preferences`
- AI-related tables for personalization

## Implementation Notes

1. Use UUIDs for all primary keys (security, scalability)
2. All timestamps use UTC
3. Soft delete pattern for User, Question, Test (is_active/is_deleted flags)
4. Foreign keys with appropriate CASCADE/RESTRICT rules
5. Database-level constraints for data integrity
6. Migration system (Alembic) for schema changes

This schema will be implemented in **Phase 2**.
