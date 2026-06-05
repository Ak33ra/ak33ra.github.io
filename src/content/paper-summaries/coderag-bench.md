---
title: 'CodeRAG-Bench: Can Retrieval Augment Code Generation?'
paper_url: 'https://aclanthology.org/2025.findings-naacl.176.pdf'
venue: 'NAACL Findings'
paper_year: 2025
pub_date: 2026-05-15
tags: ['retrieval-augmented generation', 'RAG', 'LLM', 'code generation']
---

## Summary

RAG was observed to increase performance of LMs on text-oriented tasks, but its
capabilities for coding specifically are underexplored. CodeRAG-Bench introduces
a benchmarking dataset for evaluating LMs and RAG on coding tasks specifically.
The paper finds that retrieving high-quality code improves code generation, but
retrievers often struggle to fetch useful contexts, and generators sometimes
struggle to use that context effectively.

## Notes

The context is appended to the prompt.

## Questions

- How does retrieval happen?
- How is the score computed and reported? (e.g. similarity %, functional
  equivalence to the solution, etc.?)
