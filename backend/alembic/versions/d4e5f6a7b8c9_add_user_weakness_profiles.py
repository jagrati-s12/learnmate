"""add user weakness profiles and attempt fields + historical pyq

Revision ID: d4e5f6a7b8c9
Revises: None
Create Date: 2026-09-24 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = 'd4e5f6a7b8c9'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'user_weakness_profiles',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('topic_id', sa.Integer(), nullable=False),
        sa.Column('total_attempted', sa.Integer(), server_default='0'),
        sa.Column('total_correct', sa.Integer(), server_default='0'),
        sa.Column('weakness_score', sa.Float(), server_default='0.5'),
        sa.Column('trend', sa.String(20), nullable=True),
        sa.Column('last_attempted_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_calculated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'topic_id')
    )
    op.create_index('ix_user_weakness_user', 'user_weakness_profiles', ['user_id'])
    op.create_index('ix_user_weakness_topic', 'user_weakness_profiles', ['topic_id'])

    op.create_table(
        'historical_pyq',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('topic_id', sa.Integer(), nullable=False),
        sa.Column('year', sa.Integer(), nullable=False),
        sa.Column('frequency', sa.Float(), server_default='1.0'),
        sa.Column('weightage', sa.Float(), server_default='0.05'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['topic_id'], ['topics.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )

    op.add_column('question_attempts', sa.Column('time_category', sa.String(20), nullable=True))
    op.add_column('question_attempts', sa.Column('difficulty_rating', sa.Integer(), nullable=True))
    op.add_column('question_attempts', sa.Column('confidence', sa.Float(), server_default='0.5', nullable=True))
    op.add_column('question_attempts', sa.Column('repeated_mistake', sa.Boolean(), server_default='false', nullable=True))
    op.add_column('question_attempts', sa.Column('mistake_explanation', sa.Text(), nullable=True))

def downgrade():
    op.drop_column('question_attempts', 'mistake_explanation')
    op.drop_column('question_attempts', 'repeated_mistake')
    op.drop_column('question_attempts', 'confidence')
    op.drop_column('question_attempts', 'difficulty_rating')
    op.drop_column('question_attempts', 'time_category')
    op.drop_table('historical_pyq')
    op.drop_index('ix_user_weakness_topic', table_name='user_weakness_profiles')
    op.drop_index('ix_user_weakness_user', table_name='user_weakness_profiles')
    op.drop_table('user_weakness_profiles')
