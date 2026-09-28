"""
Bayesian Knowledge Tracing (BKT) Engine

Parameters (Standard Priors for 4-Option SSC JE MCQs):
- P(L0) = 0.10 : Prior probability of initial topic mastery.
- P(T)   = 0.15 : Probability of learning/transitioning on a question attempt.
- P(G)   = 0.20 : Probability of a lucky guess on 4-option MCQ.
- P(S)   = 0.10 : Probability of a careless slip on a known question.
"""

P_T = 0.15
P_G = 0.20
P_S = 0.10

def update_bkt(p_l_prev: float, is_correct: bool) -> float:
    """
    Updates the latent mastery probability given the previous probability
    and the correctness of the current attempt.
    """

    # Step 1: Compute posterior probability given observation
    if is_correct:
        # P(L_t | Correct) = P(L_{t-1}) * (1 - S) / (P(L_{t-1}) * (1 - S) + (1 - P(L_{t-1})) * G)
        numerator = p_l_prev * (1 - P_S)
        denominator = (p_l_prev * (1 - P_S)) + ((1 - p_l_prev) * P_G)
    else:
        # P(L_t | Incorrect) = P(L_{t-1}) * S / (P(L_{t-1}) * S + (1 - P(L_{t-1})) * (1 - G))
        numerator = p_l_prev * P_S
        denominator = (p_l_prev * P_S) + ((1 - p_l_prev) * (1 - P_G))

    p_l_updated = numerator / denominator

    # Step 2: Apply Learning Transition Step
    # P(L_{t+1}) = P(L_t) + (1 - P(L_t)) * T
    p_l_next = p_l_updated + (1 - p_l_updated) * P_T

    # Clamp output
    return max(0.01, min(0.99, p_l_next))
