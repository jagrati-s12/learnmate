"""Add negative_marking to mock_tests and update score to float

Revision ID: b7e9f42a8c3d
Revises: aebe8f53fcb7
Create Date: 2026-09-01 12:05:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7e9f42a8c3d'
down_revision = 'aebe8f53fcb7'
branch_labels = None
depends_on = None


def upgrade():
    # Add negative_marking column to mock_tests
    op.add_column('mock_tests', sa.Column('negative_marking', sa.Float(), nullable=True))

    # Update existing rows to have default negative marking of 0.25
    op.execute("UPDATE mock_tests SET negative_marking = 0.25 WHERE negative_marking IS NULL")

    # Make the column non-nullable after setting defaults
    op.alter_column('mock_tests', 'negative_marking', nullable=False, server_default='0.25')

    # Change score column from Integer to Float in mock_test_attempts
    # SQLite doesn't support ALTER COLUMN TYPE directly, so we need to:
    # 1. Create new column
    # 2. Copy data
    # 3. Drop old column
    # 4. Rename new column
    op.add_column('mock_test_attempts', sa.Column('score_new', sa.Float(), nullable=True))
    op.execute("UPDATE mock_test_attempts SET score_new = CAST(score AS FLOAT)")
    op.drop_column('mock_test_attempts', 'score')
    op.alter_column('mock_test_attempts', 'score_new', new_column_name='score')
    op.alter_column('mock_test_attempts', 'score', nullable=False, server_default='0.0')


def downgrade():
    # Revert score column back to Integer
    op.add_column('mock_test_attempts', sa.Column('score_old', sa.Integer(), nullable=True))
    op.execute("UPDATE mock_test_attempts SET score_old = CAST(score AS INTEGER)")
    op.drop_column('mock_test_attempts', 'score')
    op.alter_column('mock_test_attempts', 'score_old', new_column_name='score')
    op.alter_column('mock_test_attempts', 'score', nullable=False, server_default='0')

    # Remove negative_marking column from mock_tests
    op.drop_column('mock_tests', 'negative_marking')
