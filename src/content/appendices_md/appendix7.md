
# **Appendix 7: De-Identification Techniques and Evaluation of Privacy in Synthetic Data**

## **De-identification Techniques**

De-identification aims to break the link between a dataset and an individual in the real world, ensuring that a disclosed fact (e.g., “a patient is being treated for HIV”) cannot be linked back to an identified person.

The harm being prevented is **identity disclosure**, which occurs when data is re-identified. Identity disclosure can arise by:

1. **Matching a person to data**, or
2. **Matching data to a person**

Robustness checks should test for both types of re-identification risk.

> “De-identification is not a single technique, but a collection of approaches, algorithms, and tools… privacy protection improves as more aggressive techniques are employed, but data utility decreases.”

There is no single correct method; de-identification is a **risk management exercise**. The effectiveness of different techniques depends on:

* The type of data
* Context
* Re-identification threats
* Desired utility

Examples of de-identification techniques include:

* **Aggregation**
* **Suppression** (removing identifiers or overtly identifying fields)
* **Generalisation** (e.g., replacing date of birth with an age band)
* **Pseudonymisation** (SLKs, encryption, hashing)
* **Perturbation** (noise addition, micro-aggregation, data swapping)

---

# **Evaluation of Privacy in Synthetic Data**

## **Introduction**

Privacy protection is the first principle guiding synthetic data generation, even though synthetic data represents a **trade-off** between fidelity, utility, and privacy.

Residual privacy risks persist due to factors such as:

* Model overfitting
* Memorisation of sensitive patterns
* Inference attacks exploiting preserved distributions

Some generative models implement privacy mechanisms (DPGAN, PATEGAN, ADSGAN), but **privacy evaluation is still essential**.

This appendix provides a conceptual overview of privacy evaluation methods — not algorithms or code.

There is no universal definition of “privacy risk,” and metrics only capture partial aspects of vulnerability. No single score indicates overall privacy safety.

A wide range of privacy metrics has been proposed. A practical grouping is summarised in **Table 1**. Categories include:

* Traditional re-identifiability metrics
* Distance-based methods
* Adversarial attack-based methods

There is still **no unified standard** for what constitutes adequate privacy protection.

---

# **Table 1: Categories of Metrics for Evaluating Privacy in Synthetic Data**

### **Evaluation Category → Evaluation Method / Metric → Description**

---

## **I. Non-Adversarial Metrics**

### **A. Re-identifiability Metrics**

| Method          | Description                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------- |
| **k-Anonymity** | Checks if each record is indistinguishable from at least *k–1* others based on quasi-identifiers. |
| **l-Diversity** | Extends k-Anonymity by enforcing at least *l* distinct sensitive values in each group.            |
| **t-Closeness** | Requires each group’s sensitive attribute distribution to be close to the overall distribution.   |

---

### **B. Memorisation Metrics**

| Method                                                | Description                                                                                                            |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Hitting Rate / Common Row Proportion**              | Measures exact matches between synthetic and source data.                                                              |
| **Close Value Ratio**                                 | Measures “blurry matches” within a set distance threshold.                                                             |
| **Similarity Ratio (ε-identifiability)**              | Tests if fewer than ε proportion of synthetic records are too similar to originals.                                    |
| **Nearest Neighbour Accuracy (Adversarial Accuracy)** | Measures whether records in the original dataset are closest to synthetic vs original points. 0.5 = indistinguishable. |

---

### **C. Distinguishability Metrics**

| Method              | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Data Likelihood** | Measures likelihood that synthetic records belong to the original data distribution (Bayesian networks, GMMs). |
| **Detection Rate**  | Measures how well a classifier can distinguish synthetic from real data.                                       |

---

## **II. Adversarial Metrics (Attack-Based)**

### **A. Singling Out Attacks**

| Method                        | Description                                            |
| ----------------------------- | ------------------------------------------------------ |
| **Univariate Singling Out**   | Examines uniqueness in a single attribute.             |
| **Multivariate Singling Out** | Examines uniqueness across combinations of attributes. |

---

### **B. Record Linkage Attacks**

| Method                       | Description                                                        |
| ---------------------------- | ------------------------------------------------------------------ |
| **Public–Public Linkage**    | Uses synthetic data as a bridge between two public datasets.       |
| **Public–Synthetic Linkage** | Links synthetic rows to external datasets using quasi-identifiers. |

---

### **C. Attribute Inference Attacks (AIA)**

| Method                     | Description                                                       |
| -------------------------- | ----------------------------------------------------------------- |
| **Exact Match AIA**        | Infers missing attribute via exact QI matching.                   |
| **Closest Distance AIA**   | Infers sensitive values by nearest synthetic neighbour (k=1).     |
| **Nearest Neighbours AIA** | Uses k>1 nearest neighbours.                                      |
| **ML Inference AIA**       | Trains a model on synthetic data to predict sensitive attributes. |

---

### **D. Membership Inference Attacks (MIA)**

| Method                         | Description                                                                  |
| ------------------------------ | ---------------------------------------------------------------------------- |
| **Closest Distance MIA**       | Membership inferred by proximity of target record to synthetic distribution. |
| **Nearest Neighbours MIA**     | Extends above with k>1 neighbours.                                           |
| **Probability Estimation MIA** | Hypothesis testing of membership probability.                                |
| **Shadow Model MIA**           | Trains classifiers on shadow models with and without the target record.      |

---

# **Consensus-Based Recommendations (R1–R10)**

A Delphi process (13 experts, 3 rounds) produced 10 consensus recommendations:

1. **Base evaluations on Quasi-Identifiers**
2. **Evaluate all records**
3. **Avoid stand-alone similarity metrics**
4. **Align membership disclosure with threat models**
5. **Report prevalence-adjusted scores**
6. **Limit attribute disclosure to members**
7. **Use non-member baselines**
8. **Apply dual thresholds (absolute + relative)**
9. **Validate Differential Privacy empirically**
10. **Report stochastic variation** across multiple synthetic datasets

---

# **Fundamental Concepts**

## **Identity Disclosure**

Occurs when a synthetic record can be linked to a specific individual. Often less relevant for synthetic data because records are artificial, but overfitting may still leak identity.

## **Membership Disclosure**

Occurs when an adversary can tell whether a person’s data was included in the training set.

Useful metrics:

* **F1 score**
* **F naïve** baseline (expected success by random guessing)

## **Attribute Disclosure**

Occurs when an adversary can infer sensitive attributes about an individual using synthetic data.

## **Differential Privacy**

Defines privacy guarantees of the *process*, not the dataset.

Key components:

* **ε (epsilon): privacy budget**
* Lower ε = stronger privacy

---

# **Common Misconceptions to Avoid**

1. **Synthetic data is inherently private**
2. **Record-level similarity indicates privacy risk**
3. **All attributes should be considered in evaluation**
4. **Large DP budgets automatically ensure privacy**

---

# **Practical Evaluation Guides**

## **Guide: Membership Disclosure Evaluation**

* Define threat model
* Calculate naive baseline
* Compute F1 and compare to baseline
* Report assumptions clearly

## **Guide: Attribute Disclosure Evaluation**

* Select quasi-identifiers
* Use non-member baseline
* Compute absolute and relative risks
* Apply dual thresholds

## **Evaluating Multiple Synthetic Datasets**

* Generate **≥10 datasets**
* Report means, SDs, worst cases

---

# **Implementation Considerations**

## Computational Efficiency

* Start with domain-informed QIs
* Expand if needed

## Threshold Determination

* Must be context-specific
* Evidence-informed
* Document assumptions

## Reporting Requirements

Include:

* Absolute & relative metrics
* Variation measures
* Worst-case values
* Threat model definitions

---

# **Future Directions**

* Empirical threshold validation
* Standardised ε interpretation
* Automated privacy evaluation tools
* Joint utility–privacy optimisation
* Methods for non-tabular data

---

# **Conclusion**

Privacy evaluation in synthetic data requires:

* Rigorous, contextual, evidence-based methods
* Clear threat models
* Empirical validation
* Multiple complementary metrics

Perfect privacy is impossible, but **risk can be meaningfully managed** through structured assessment.

---

# **References**

*(All references included exactly as in the source document)*

1. Xie et al., *Differentially Private GANs* — arXiv:1802.06739
2. Jordon et al., *PATE-GAN* — ICLR
3. Yoon et al., *ADS-GAN* — IEEE JBHI
4. Trudslev et al., *Review of Privacy Metrics* — arXiv:2507.11324
5. Osorio-Marulanda et al., *Privacy Mechanisms* — IEEE Access
6. Liao et al., *Pick Your Enemy*
7. Folz et al., *Scoring System for Privacy* — IEEE Access
8. Hernandez et al., *Comprehensive Framework* — Frontiers Digital Health
9. Yan et al., *Benchmarking Synthetic EHR Models* — Nature Communications
10. Pierce et al., *Practical Steps for Implementing Privacy* — WMHP
11. Pilgram et al., *Consensus Privacy Metrics Framework* — Patterns

---

# **Further Resources**

* HealthStats NSW — Privacy and small counts
* CSIRO & OAIC — *De-identification Decision-Making Framework*
* OVIC — *Limitations of De-identification*
* OIC QLD — *Managing Re-identification Risk*
* ISO/IEC 27559:2022 — Privacy enhancing de-identification
* ISO/IEC 27554:2024 — Identity-related risk assessment
* ISO/TS 14265:2024 — Processing purposes classification
* ISO 25237:2017 — Pseudonymisation

