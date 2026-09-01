"""Initial database schema

Revision ID: 001
Revises:
Create Date: 2026-08-31 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('roll_number', sa.String(), nullable=True),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('date_of_birth', sa.DateTime(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('is_admin', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('ix_users_roll_number', 'users', ['roll_number'], unique=True)

    # Create subjects table
    op.create_table(
        'subjects',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.create_index('ix_subjects_id', 'subjects', ['id'], unique=False)
    op.create_index('ix_subjects_name', 'subjects', ['name'], unique=False)

    # Create topics table
    op.create_table(
        'topics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('subject_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['subject_id'], ['subjects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_topics_id', 'topics', ['id'], unique=False)
    op.create_index('ix_topics_name', 'topics', ['name'], unique=False)
    op.create_index('ix_topics_subject_id', 'topics', ['subject_id'], unique=False)

    # Create questions table
    op.create_table(
        'questions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('topic_id', sa.Integer(), nullable=False),
        sa.Column('question_text', sa.Text(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.Column('difficulty', sa.Enum('easy', 'medium', 'hard', name='difficultylevel'), nullable=True),
        sa.Column('marks', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_questions_id', 'questions', ['id'], unique=False)
    op.create_index('ix_questions_topic_id', 'questions', ['topic_id'], unique=False)

    # Create question_options table
    op.create_table(
        'question_options',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('option_text', sa.Text(), nullable=False),
        sa.Column('option_label', sa.String(length=1), nullable=False),
        sa.Column('is_correct', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_question_options_id', 'question_options', ['id'], unique=False)
    op.create_index('ix_question_options_question_id', 'question_options', ['question_id'], unique=False)

    # Create mock_tests table
    op.create_table(
        'mock_tests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('test_type', sa.Enum('full_syllabus', 'subject_wise', 'topic_wise', 'custom', name='mocktesttype'), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=False),
        sa.Column('total_marks', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_mock_tests_id', 'mock_tests', ['id'], unique=False)

    # Create mock_test_questions table
    op.create_table(
        'mock_test_questions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('mock_test_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('question_order', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['mock_test_id'], ['mock_tests.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_mock_test_questions_id', 'mock_test_questions', ['id'], unique=False)
    op.create_index('ix_mock_test_questions_mock_test_id', 'mock_test_questions', ['mock_test_id'], unique=False)
    op.create_index('ix_mock_test_questions_question_id', 'mock_test_questions', ['question_id'], unique=False)

    # Create mock_test_attempts table
    op.create_table(
        'mock_test_attempts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('mock_test_id', sa.Integer(), nullable=False),
        sa.Column('started_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('completed_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('total_time_seconds', sa.Integer(), nullable=True),
        sa.Column('score', sa.Integer(), nullable=True),
        sa.Column('total_questions', sa.Integer(), nullable=False),
        sa.Column('correct_answers', sa.Integer(), nullable=True),
        sa.Column('incorrect_answers', sa.Integer(), nullable=True),
        sa.Column('unattempted', sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['mock_test_id'], ['mock_tests.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_mock_test_attempts_id', 'mock_test_attempts', ['id'], unique=False)
    op.create_index('ix_mock_test_attempts_user_id', 'mock_test_attempts', ['user_id'], unique=False)
    op.create_index('ix_mock_test_attempts_mock_test_id', 'mock_test_attempts', ['mock_test_id'], unique=False)

    # Create question_attempts table
    op.create_table(
        'question_attempts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('mock_test_attempt_id', sa.Integer(), nullable=True),
        sa.Column('selected_option', sa.String(length=1), nullable=True),
        sa.Column('is_correct', sa.Boolean(), nullable=True),
        sa.Column('time_taken_seconds', sa.Integer(), nullable=True),
        sa.Column('is_marked_for_review', sa.Boolean(), nullable=True),
        sa.Column('attempted_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['mock_test_attempt_id'], ['mock_test_attempts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_question_attempts_id', 'question_attempts', ['id'], unique=False)
    op.create_index('ix_question_attempts_user_id', 'question_attempts', ['user_id'], unique=False)
    op.create_index('ix_question_attempts_question_id', 'question_attempts', ['question_id'], unique=False)
    op.create_index('ix_question_attempts_mock_test_attempt_id', 'question_attempts', ['mock_test_attempt_id'], unique=False)

    # Create bookmarks table
    op.create_table(
        'bookmarks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'question_id', name='uq_user_question_bookmark')
    )
    op.create_index('ix_bookmarks_id', 'bookmarks', ['id'], unique=False)
    op.create_index('ix_bookmarks_user_id', 'bookmarks', ['user_id'], unique=False)
    op.create_index('ix_bookmarks_question_id', 'bookmarks', ['question_id'], unique=False)


def downgrade():
    # Drop tables in reverse order (respecting foreign key constraints)
    op.drop_index('ix_bookmarks_question_id', table_name='bookmarks')
    op.drop_index('ix_bookmarks_user_id', table_name='bookmarks')
    op.drop_index('ix_bookmarks_id', table_name='bookmarks')
    op.drop_table('bookmarks')

    op.drop_index('ix_question_attempts_mock_test_attempt_id', table_name='question_attempts')
    op.drop_index('ix_question_attempts_question_id', table_name='question_attempts')
    op.drop_index('ix_question_attempts_user_id', table_name='question_attempts')
    op.drop_index('ix_question_attempts_id', table_name='question_attempts')
    op.drop_table('question_attempts')

    op.drop_index('ix_mock_test_attempts_mock_test_id', table_name='mock_test_attempts')
    op.drop_index('ix_mock_test_attempts_user_id', table_name='mock_test_attempts')
    op.drop_index('ix_mock_test_attempts_id', table_name='mock_test_attempts')
    op.drop_table('mock_test_attempts')

    op.drop_index('ix_mock_test_questions_question_id', table_name='mock_test_questions')
    op.drop_index('ix_mock_test_questions_mock_test_id', table_name='mock_test_questions')
    op.drop_index('ix_mock_test_questions_id', table_name='mock_test_questions')
    op.drop_table('mock_test_questions')

    op.drop_index('ix_mock_tests_id', table_name='mock_tests')
    op.drop_table('mock_tests')

    op.drop_index('ix_question_options_question_id', table_name='question_options')
    op.drop_index('ix_question_options_id', table_name='question_options')
    op.drop_table('question_options')

    op.drop_index('ix_questions_topic_id', table_name='questions')
    op.drop_index('ix_questions_id', table_name='questions')
    op.drop_table('questions')

    op.drop_index('ix_topics_subject_id', table_name='topics')
    op.drop_index('ix_topics_name', table_name='topics')
    op.drop_index('ix_topics_id', table_name='topics')
    op.drop_table('topics')

    op.drop_index('ix_subjects_name', table_name='subjects')
    op.drop_index('ix_subjects_id', table_name='subjects')
    op.drop_table('subjects')

    op.drop_index('ix_users_roll_number', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')

    # Drop enum types
    op.execute('DROP TYPE IF EXISTS difficultylevel')
    op.execute('DROP TYPE IF EXISTS mocktesttype')
