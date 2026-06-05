---
title: 'LAPS: A Length-Aware-Prefill LLM Serving System'
paper_url: 'https://arxiv.org/pdf/2601.11589'
venue: 'MLSys'
paper_year: 2026
pub_date: 2026-06-03
tags: ['OS for machine learning', 'GPU OS', 'GPU resource management']
---

## Summary

LAPS proposes the split of long (compute bound) and short (memory bound) 
prefills, motivated by the observation that in real traces, a large fraction 
of prompts are <256 tokens. Co-batching those with rare long prefills causes 
head-of-line blocking. 

They formalize this with an M/G/1 queue, quantifying the extra wait 
caused by HoL blocks.

## Conclusions

The approach is strong in PD disagg settings with high concurrency. 
Gains grow with concurrency (1->64). It additionally benefits from more 
instances, giving flexibility over partitioning. 
In SLA-constrained serving with a 0.4 TTFT SLO, LAPS cuts violations about 
10% vs SGLang-with-router and ~30% vs vanilla DP in a single instance. 

Without PD disagg, prefill RPS drops under LAPS. The authors claim this is 
due to the inability to exploit CUDA Graphs with mixed prefill-decode. 

## Gaps 

The paper doesn't stress test the implementation against workloads that are 
homogenous. In this case, LAPS should collapse to the baseline, but this 
hasn't been verified. They only test against favorable heterogenous traces.

It doesn't seem like they describe the mix-mode implementation. Not sure 
if continuous batching is on or not.
