---
title: 'ServerFilling: A Better Approach to Packing Multiserver Jobs'
paper_url: 'https://www.cs.cmu.edu/~harchol/Papers/Applied23.pdf'
venue: 'ApPLIED'
paper_year: 2023
pub_date: 2026-05
tags: ['multiserver jobs', 'scheduling', 'packing', 'queueing theory']
---

## Summary

As jobs start to require multiple servers (e.g. parallel workloads), queueing
theorists have been working on how to best model these jobs and design policies
that achieve the following goals:

1. Throughput optimality, and
2. Low and theoretically predictable mean queueing times.

The paper surveys recent work and compares them to the ServerFilling (SF)
policy, which achieves both (1) and (2).

## Key Insights

- Multiserver settings approach one large server in the limit.

## Techniques

- Definition (or new definition) of key terms, for this setting. E.g. defining
  load $\rho$ for the multiserver job model. Allows us to bring old techniques to
  new problems, given a reasonable definition.
- Target a specific but usable regime. Here, the number of servers and the
  number of servers jobs need are both powers of 2.
- Estimate a quantity by lower- and upper-bounding it. Taking the limit is often
  insightful.
- Analysis used the work-conserving finite-skip (WCFS) model:
  <https://arxiv.org/abs/2109.12663>.
- Comparison via simulation.

## Notes

I find it compelling that the paper discusses goals of policies, similar to
system design. In addition to (1) and (2) above, the authors emphasize
simplicity as a third goal. That is, we shouldn't have to optimize over all
possible packings, nor perform excessive preemption. Given these three goals, a
policy is both analytically tractable and useful in practice.

Paper clearly defines all the necessary formulas, terms, and the target goals
and setting. Gives the reader context while scoping the problem.

Systems can become unstable (queue grows indefinitely) even when $\rho < 1$, if
the system is not throughput-optimal.

## Conclusions

SF and SF-SRPT outperform other policies discussed, though they require minimal
and heavy preemption respectively. In real systems, preemption is often
expensive — can we get the benefits of SF/SF-SRPT without preemption? Or find an
application where preemption is cheap?

Analytical tractability is an important feature. Even being able to estimate the
mean waiting time under a policy is valuable. Applications need guarantees: if
the most ideal policy had no provable guarantees, it's unlikely anyone would use
it.

## Questions

- What makes the analysis of FCFS/MSF/etc. hard?
