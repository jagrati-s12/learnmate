"""
Welford's Running Stats & Burnout Detector

Computes running mean and variance in O(1) without storing all past scores.
Detects potential burnout anomalies.
"""

import math

def update_welford_stats(n: int, mean: float, m2: float, new_score: float):
    """
    Updates running mean and variance using Welford's algorithm.
    Returns (updated_n, updated_mean, updated_m2, updated_variance, updated_std_dev)
    """
    n += 1
    delta = new_score - mean
    mean += delta / n
    delta2 = new_score - mean
    m2 += delta * delta2

    variance = m2 / (n - 1) if n > 1 else 0.0
    std_dev = math.sqrt(variance)

    return n, mean, m2, variance, std_dev

def check_for_burnout(test_count: int, mean: float, std_dev: float, new_score: float) -> bool:
    """
    Detects if a new score is an anomaly signaling burnout.
    Condition: (new_score - mean) / std_dev < -2.0 AND (mean - new_score) >= 15.0%
    """
    if test_count < 5:
        return False

    # Check threshold using previous statistics (mean/std_dev passed are pre-update)
    if std_dev == 0:
        return False

    z_score = (new_score - mean) / std_dev
    drop = mean - new_score

    return z_score < -2.0 and drop >= 15.0
