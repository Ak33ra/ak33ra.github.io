---
title: 'LithOS'
paper_url: 'https://arxiv.org/pdf/2504.15465'
venue: 'SOSP'
paper_year: 2025
pub_date: 2026-05
tags: ['OS for machine learning', 'GPU OS', 'GPU resource management']
---

## Summary

Introduces abstractions and mechanisms for efficient GPU resource management,
improving efficiency while maintaining or increasing throughput.

## Extensions 

- Can LithOS support VM-like abstractions for GPU partitions? E.g. allowing 
MIG instances to have shared memory. A possible application is PD disagg 
on the same GPU, which would circumvent the need for KV cache transfer. 
- Could LithOS be made aware of user SLOs? Perhaps these could be attached to 
CUDA Graphs as well.
