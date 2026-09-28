"""
Cognitive Load Profiler

Calculates the Relative Time Index (RTI) and classifies the performance
into cognitive quadrants.
"""

def calculate_rti(time_taken: float, mu_topic: float, sigma_topic: float) -> float:
    """
    Calculates RTI (z-score) based on time taken vs historical benchmark.
    RTI = (t_user - mu_topic) / sigma_topic
    """
    if sigma_topic == 0:
        return 0.0
    return (time_taken - mu_topic) / sigma_topic

def classify_cognitive_quadrant(rti: float, is_correct: bool) -> str:
    """
    Classifies attempt into pedagogical diagnosis:
    - Quadrant 1: Fast Master (Fluent knowledge / Intuitive)
    - Quadrant 2: Methodical (Solid concept, needs speed rep)
    - Quadrant 3: Speed Trap (Rushed, slip, or blind guess)
    - Quadrant 4: High Load (Conceptual struggle / confusion)
    """
    if is_correct:
        if rti <= 0.0:
            return "Fast Master" # Quad 1
        else:
            return "Methodical" # Quad 2
    else:
        if rti < -0.4:
            return "Speed Trap" # Quad 3
        else:
            return "High Load" # Quad 4
