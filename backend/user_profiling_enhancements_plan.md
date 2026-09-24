# Future Enhancements: AI Mock Test Generation & User Profiling System

## Context

The current LearnMate platform has a solid foundation for AI-powered mock test generation with:
- Personalized test distribution based on PYQ baseline + user weaknesses
- Gemini-powered candidate personality profiles
- Frontend integration for generating and taking AI tests

However, several advanced features from the "future implementations" section are still needed to make the system truly adaptive and intelligent. This document outlines the phased implementation plan.

## Current Architecture Review

### 1. Weakness Analysis (`ai_test_generator.py`)
- **Method**: Looks at last 5 mock test attempts, groups by `topic_id`, calculates accuracy per topic
- **Limitation**: 
  - Only considers mock test attempts (ignores practice question attempts)
  - Uses simple average with no recency weighting
  - No tracking of improvement trends over time
  - Broken `func.cast(QuestionAttempt.is_correct, func.integer())` on Postgres

### 2. Analytics API (`analytics.py`)
- **Performance endpoint**: Subject-level weak/strong topics (aggregates `QuestionAttempt` by Subject)
- **AI Profile endpoint**: Uses Gemini to generate title + 3 tips based on subject-level data
- **Missing**: No topic-level weakness API, no historical trend analysis

### 3. Frontend Display (`Performance.jsx`)
- **Current**: Shows Gemini personality profile, overall metrics, subject-level weak/strong topics
- **Missing**: Detailed topic-level breakdown, visual weakness indicators, improvement trends

## Phase 1: Core Enhancements (Immediate Priority)

### 1.1 Fix `func.cast` Bug in Weakness Calculation
**File**: `backend/app/services/ai_test_generator.py`
**Issue**: Line 73 uses invalid SQLAlchemy syntax
**Fix**: Change `func.cast(QuestionAttempt.is_correct, func.integer())` → `func.cast(QuestionAttempt.is_correct, Integer)`

### 1.2 Enhanced Weakness Algorithm
**Current**: Flat average of last 5 attempts
**Enhanced**: Recency-weighted average with exponential decay
```python
def calculate_user_weaknesses_with_recency(db: Session, user_id: int):
    """
    Recency-weighted weakness calculation with improvement tracking
    Returns: {topic_id: {"weakness": float, "accuracy": float, "trend": "improving"/"declining"/"stable"}}
    """
    # Get last 10 attempts (or all if <10)
    attempts = db.query(MockTestAttempt).filter(
        MockTestAttempt.user_id == user_id,
        MockTestAttempt.completed_at.isnot(None)
    ).order_by(MockTestAttempt.completed_at.desc()).limit(10).all()
    
    # Apply recency weights: most recent = 2.0, previous = 1.5, then 1.0
    # Calculate topic performance over time, track improvement trends
```

### 1.3 Topic-Level Weakness API Endpoint
**Endpoint**: `GET /analytics/weakness-profile`
**Response**:
```json
{
  "topics": [
    {
      "topic_id": 15,
      "topic_name": "Bending Moment Diagrams",
      "subject_name": "Structural Analysis",
      "total_attempted": 42,
      "correct": 14,
      "accuracy_percent": 33.3,
      "weakness_score": 0.67,
      "trend": "declining",
      "pyq_weightage": 0.08,
      "priority_score": 0.75
    }
  ],
  "summary": {
    "top_weak_topics": [],
    "top_improving_topics": [],
    "recommended_focus_areas": []
  }
}
```

## Phase 2: Advanced Analytics & Storage

### 2.1 User Profile Cache Table
**Model**: `UserWeaknessProfile`
```sql
CREATE TABLE user_weakness_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic_id INTEGER REFERENCES topics(id),
    total_attempted INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2),
    weakness_score DECIMAL(3,2),
    trend VARCHAR(20), -- 'improving', 'declining', 'stable'
    last_calculated_at TIMESTAMP,
    UNIQUE(user_id, topic_id)
);
```

**Purpose**: Avoid recomputing weaknesses on every request, track long-term trends

### 2.2 Improved Gemini Profile Generation
**Current**: Uses subject-level weak/strong topics
**Enhanced**: Incorporate topic-level weaknesses, improvement trends, time-of-day performance patterns

### 2.3 Question Difficulty & Time Analysis
**Enhancement**: Track per-question difficulty scores and user response times
```python
# Add to QuestionAttempt model
time_category = Column(String(20))  # 'fast' (<30s), 'medium', 'slow' (>90s)
confidence_level = Column(String(20))  # 'high', 'medium', 'low' (via post-test survey)

# Enhanced test generation considers difficulty + time patterns
```

## Phase 3: Frontend Visualization

### 3.1 Unified Performance Dashboard
**Component**: Enhanced `Performance.jsx`
**Visual Hierarchy**:
1. **Top Section**: Overall metrics (current implementation)
2. **Middle Section**: Visual weakness radar chart (topics arranged by subject)
3. **Bottom Section**: Improvement timeline charts (accuracy over last 10 attempts)

### 3.2 Weakness Visualization Components
**WeaknessPill.jsx**: Color-coded topic badges
```jsx
<WeaknessPill
  topic="Bending Moment Diagrams"
  subject="Structural Analysis"
  accuracy={33.3}
  trend="declining"
  priority="high"
/>
```

**RadarChart.jsx**: Multi-topic weakness visualization
**ImprovementTimeline.jsx**: Accuracy trends over time

### 3.3 API Updates
**File**: `frontend/src/api/analytics.ts`
```typescript
// New endpoints
getWeaknessProfile(): Promise<WeaknessProfileResponse>;
getImprovementTrends(): Promise<ImprovementTrendsResponse>;
getQuestionDifficultyAnalysis(): Promise<DifficultyAnalysisResponse>;
```

## Phase 4: Advanced AI Features

### 4.1 Weekly Study Plan Generation
**Endpoint**: `POST /analytics/generate-study-plan`
**Uses**: Gemini to create personalized weekly schedule based on:
- Topic weaknesses and priorities
- User's available study hours (from weekly activity data)
- Upcoming mock test schedule
- Topic dependencies (prerequisites)

### 4.2 Mistake Pattern Analysis
**Feature**: Identify recurring mistake types
```python
def analyze_mistake_patterns(db: Session, user_id: int):
    """
    Categorize mistakes by:
    - Conceptual errors (wrong fundamental understanding)
    - Calculation errors (math mistakes)
    - Time-pressure errors (rushed answers)
    - Careless mistakes (misread questions)
    """
```

### 4.3 Confidence-Based Question Selection
**Enhancement**: Track user confidence levels and adjust question selection
- Low confidence + wrong answer → similar easier questions
- High confidence + wrong answer → fundamental concept review questions
- Low confidence + correct answer → confidence-building repetition

## Implementation Sequence

### Week 1: Core Backend
1. Fix `func.cast` bug
2. Implement recency-weighted weakness algorithm
3. Create `GET /analytics/weakness-profile` endpoint
4. Update `ai_test_generator.py` to use enhanced algorithm

### Week 2: Frontend Integration
1. Create API methods in `analytics.ts`
2. Build WeaknessPill, RadarChart components
3. Integrate into enhanced `Performance.jsx`
4. Add loading states and error handling

### Week 3: Advanced Features
1. Implement `UserWeaknessProfile` model and caching
2. Create improved Gemini profile with topic-level data
3. Build mistake pattern analysis prototype

### Week 4: Polish & Testing
1. Performance optimization for large datasets
2. Comprehensive error handling
3. Integration testing with existing mock tests
4. Documentation and user guides

## Technical Dependencies

### Database Migrations Required
1. `UserWeaknessProfile` table
2. Optional: Additional columns on `QuestionAttempt` for time categorization
3. Optional: `UserStudyPreference` table for personalized settings

### External Services
- **Gemini API**: Already integrated, enhanced prompts needed
- **Optional Redis Cache**: For caching computed weakness profiles
- **Optional ClickHouse/OLAP**: For advanced analytics if dataset grows large

## Success Metrics

### Quantitative
- Reduction in weakness recomputation time (>50%)
- Improved mock test accuracy correlation (>15%)
- Increased user engagement with performance dashboard (>30%)

### Qualitative
- Users can clearly identify specific topics to focus on
- AI-generated study plans feel personalized and actionable
- Weakness visualization is intuitive and useful

## Risks & Mitigations

### Performance
- **Risk**: Weakness calculation becomes slow with many users
- **Mitigation**: Implement caching with `UserWeaknessProfile` table, scheduled background updates

### Data Quality
- **Risk**: Insufficient attempt data for meaningful analysis
- **Mitigation**: Graceful degradation to subject-level analysis, provide clear "need more data" messages

### User Experience
- **Risk**: Overwhelming complexity in performance dashboard
- **Mitigation**: Progressive disclosure, tabbed interface, beginner/advanced views

---

## Next Steps

1. **Phase 1 Approval**: Review and approve the immediate fixes and API endpoint
2. **Resource Allocation**: Determine development timeline based on team availability
3. **Testing Strategy**: Define acceptance criteria for each phase
4. **User Feedback Loop**: Plan for iterative improvements based on user feedback