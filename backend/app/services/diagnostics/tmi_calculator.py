"""
Weighted Topic Mastery Index (TMI) Calculator

Combines raw accuracy with recency decay.
"""

import math
from datetime import datetime, timezone

# Half-life = 14 days
LAMBDA_VAL = math.log(2) / 14

def calculate_tmi(attempts: list) -> float:
    """
    attempts: List of dicts {'is_correct': bool, 'timestamp': datetime}
    TMI = (0.60 * P(L) + 0.40 * DecayedAccuracy) * 100

    Note: P(L) is the latest BKT probability, which should be passed or fetched.
    We return here the Decayed Accuracy part to be combined with BKT.
    """
    if not attempts:
        return 0.0

    now = datetime.now(timezone.utc)

    sum_w = 0.0
    sum_w_correct = 0.0

    for attempt in attempts:
        days_ago = (now - attempt['timestamp']).total_seconds() / (24 * 3600)
        weight = math.exp(-LAMBDA_VAL * days_ago)

        sum_w += weight
        sum_w_correct += weight * (1 if attempt['is_correct'] else 0)

    return sum_w_correct / sum_w if sum_w > 0 else 0.0
