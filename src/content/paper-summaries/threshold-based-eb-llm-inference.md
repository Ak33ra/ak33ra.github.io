---
title: 'Threshold-Based Exclusive Batching for LLM Inference'
paper_url: 'https://arxiv.org/pdf/2606.00516'
venue: 'ICML'
paper_year: 2026
pub_date: 2026-06-12
tags: ['llm inference', 'exclusive batching']
---

## Summary

Mixed batching has become an industry standard for LLM inference, due to 
its ability to more effectively use both GPU compute and memory bandwidth. 
In vLLM v1, continuous batching with chunked prefill has even become the 
engine default. 

However, through benchmarking, this paper finds that at equal batch sizes, 
prefill-decode interference in mixed batches can inflate per-iteration 
costs above that of pure decode. The authors claim the cause to be memory 
bandwidth contention, proposing a scheduler that switches from mixed batching 
(MB) to exlusive batching (EB) based on the hardware, model, and workload 
without manual intervention. 

The results show their scheduling policy sometimes improves throughput, ttft, 
and tpot compared to vLLM baselines. In benchmarked cases where vLLM is better, 
their policy performs within 10% of the best engine considered.

## Key Insights
- Prefill-decode interference has been explored before (prefill-decode 
  disaggregation is now common), and there are ways of exploiting it 
  even on a single node.
- Their experiments and mathematical model isolate device memory bandwidth 
  as a key factor for when EB is better than MB. 

## Techniques
- Presumably extensive measurements to observe the effects of mixed batching 
  with various models and hardware.
- Fluid approximation.

## Notes
- To my understanding, they didn't confirm the memory bandwidth claim 
  via profiling, just empirically by comparing the threshold on different 
  GPUs. 
- Really like their mathematical model, and the fact that they consider 
  failure rates and the implication on their scheduler, both intuitively and 
  via derivation.

## Questions 
- There are possible mechanisms for the improvement of EB wrt MB, such as CUDA 
  Graphs or more optimized kernels for pure-decode batches. I wonder if they 
  considered these?

## Conclusions

The paper's figures are convincing that prefill-decode interference is a real 
effect, but I'm not fully sold the mechanism they proposed (memory 
bandwidth) is the full story. Their model and scheduler 
could be derived with just the observation that at a certain threshold, EB 
is more efficient than MB, and using measured per-token costs. Regardless, 
it would make sense that memory bandwidth plays a role.
