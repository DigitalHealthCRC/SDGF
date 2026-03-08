# Appendix 7: De-identification techniques and privacy evaluation in synthetic data

## De-identification

De-identification refers to a collection of technical and organisational approaches intended to reduce the likelihood that data can be associated with an identifiable individual. Preventing direct identity disclosure is important, but data may still be personal information if it remains reasonably linkable to an individual or a small group.

De-identification should therefore be understood as a risk-management exercise rather than a binary state. Privacy protection generally improves as more aggressive techniques are applied, but this usually comes at the cost of reduced data utility.

Examples of de-identification techniques include:

- Aggregation and suppression to remove identifiers or overtly identifying data fields
- Generalisation, such as replacing exact dates of birth with age bands
- Pseudonymisation using cryptographically protected transformations such as keyed hashing with appropriate key management
- Perturbation through noise addition, micro-aggregation, or data swapping

## Evaluation of privacy in synthetic data

### Overview

Privacy protection is a foundational principle of synthetic data generation, but residual privacy risks still persist. Membership and attribute inference can arise when synthetic data preserves statistical patterns from the original dataset, so privacy evaluation remains an essential part of synthetic data governance.

There is no single accepted definition or universal measure of privacy risk. Existing metrics capture only partial and often complementary aspects of risk. Results that look favourable under one metric do not rule out vulnerabilities under another. Privacy evaluation should therefore be treated as a portfolio of evidence rather than a single score.

### Types of privacy risk

- **Identity disclosure**: a synthetic record can be confidently linked to a specific person
- **Membership disclosure**: an adversary can infer whether a specific person was included in the training data
- **Attribute disclosure**: an adversary can infer new and sensitive information about an individual using synthetic data plus auxiliary knowledge

### Categories of evaluation metrics

#### I. Non-adversarial metrics

##### A. Re-identifiability metrics

| Method | Description |
| --- | --- |
| k-Anonymity | Checks whether each individual is indistinguishable from at least `k - 1` other individuals with respect to a set of quasi-identifiers. |
| l-Diversity | Extends k-anonymity by ensuring sensitive attributes within each anonymised group have at least `l` distinct values. |
| t-Closeness | Refines l-diversity by requiring the distribution of a sensitive attribute in any group to remain close to the overall dataset distribution. |

##### B. Memorisation, similarity, and distance-based metrics

| Method | Description |
| --- | --- |
| Hitting Rate (Common Row Proportion) | Measures the percentage of exact matching records between the synthetic and source data. |
| Close Value Ratio | Assesses the probability of near matches using a distance threshold. |
| Similarity Ratio (`epsilon`-identifiability) | Tests whether fewer than an `epsilon` ratio of synthetic observations are "similar enough" to those in the original dataset. |
| Nearest Neighbour Accuracy (Adversarial Accuracy) | Evaluates proximity between source and synthetic distributions, but should be interpreted cautiously because similarity-based metrics can miss serious privacy leakage. |

##### C. Distinguishability metrics

| Method | Description |
| --- | --- |
| Data Likelihood | Measures the likelihood of synthetic data belonging to the source data distribution. |
| Detection Rate | Assesses how easily models can distinguish source data from synthetic data. |

#### II. Adversarial metrics

##### A. Singling out attacks

| Method | Description |
| --- | --- |
| Singling Out Attack (Univariate) | Observes the uniqueness of a single attribute in synthetic data. |
| Singling Out Attack (Multivariate) | Examines uniqueness across combinations of attributes. |

##### B. Record linkage attacks

| Method | Description |
| --- | --- |
| Public-Public Linkage | Uses the synthetic dataset to establish links between records in two external datasets. |
| Public-Synthetic Linkage | Links rows in the synthetic dataset to an external dataset using matching criteria. |

##### C. Attribute inference attacks

| Method | Description |
| --- | --- |
| Exact Match AIA | Determines a missing target attribute by matching overlapping quasi-identifiers. |
| Closest Distance AIA | Infers a sensitive value using the nearest synthetic neighbour (`k = 1`). |
| Nearest Neighbours AIA | Uses the `k` nearest synthetic neighbours where `k > 1`. |
| ML Inference AIA | Trains a predictive model on synthetic data to infer target attributes. |

##### D. Membership inference attacks

| Method | Description |
| --- | --- |
| Closest Distance MIA | Infers membership when a target record is more similar to synthetic data than to unrelated data. |
| Nearest Neighbours MIA | Relaxes the closest-distance approach to proximity against multiple neighbours. |
| Probability Estimation MIA | Uses hypothesis testing to assess whether a target record belongs to the synthetic data distribution. |
| MIA Shadow Model | Uses shadow models trained with and without the target record to classify membership. |

## Limitations of common metrics

Similarity-based metrics are intuitive and simple to compute, but they can fail to detect serious privacy leakage and do not provide bounded privacy guarantees. A strong result on a similarity metric should not be treated as evidence that a dataset is safe.

Average-case metrics such as F1 also have important limits when used as privacy metrics:

- They were designed to summarise classifier performance on average, not individual privacy risk
- They can hide severe risk affecting a small number of people
- A low score does not prove safety
- A high score does clearly signal a privacy failure

## Differential Privacy

Differential Privacy (DP) is a property of the generation process, not the output dataset itself. It provides a probabilistic guarantee that outputs are nearly indistinguishable whether or not any single individual's data was included in the input.

- **Pure `epsilon`-DP** is the strictest definition
- **Approximate (`epsilon`, `delta`)-DP** allows a small probability that the guarantee fails

Smaller `epsilon` values provide stronger privacy guarantees. In practice, DP should not be treated as a tick-box solution because implementation flaws, invalid assumptions, or software bugs can undermine theoretical claims.

## Privacy auditing

Privacy auditing empirically tests whether a system behaves consistently with its stated privacy claims. It complements theoretical analysis by searching for concrete failures and unexpected leakage.

Examples include:

- Membership inference attacks
- Attribute inference attacks
- Reconstruction attacks
- Tests on neighbouring datasets that differ by one individual

### Canary-based auditing

Canary-based auditing injects carefully constructed artificial records into the training data, trains the generator, and then checks whether those canaries are detectable or reconstructable in the synthetic output. Detectable canaries provide concrete evidence of memorisation or leakage.

## Practical considerations for privacy evaluation

- Base evaluations on realistic quasi-identifiers that reflect likely adversary knowledge
- Evaluate the entire dataset rather than only a subset of records
- Assess both membership and attribute disclosure risks
- Empirically validate Differential Privacy claims in practice
- Report results across multiple generation runs and preserve visibility of worst-case outcomes

## Future directions and open challenges

- Better empirical privacy metrics that capture worst-case rather than average-case risk
- More practical, automated, and reproducible privacy auditing tools
- Clearer interpretation of `epsilon` and `delta` in operational settings
- Better handling of cumulative privacy loss across successive synthetic data releases
- Stronger methods for time-series, longitudinal data, free text, and other complex data types

## Conclusion

Privacy evaluation for synthetic data requires a systematic, evidence-based approach. No single workflow or metric guarantees safety. Responsible practice depends on realistic threat modelling, transparent assumptions, empirical auditing, and a portfolio of complementary evidence to understand and manage residual risk.
