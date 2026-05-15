---
title: 'Network Simulator'
summary: 'Queueing theory-based network simulator in Python and C++.'
role: 'designer + developer'
stack: [Python, C++, pybind11]
start_date: 2025-05-01
end_date: 2026-01-01        # optional; omit for ongoing
links:
  - label: 'GitHub'
    url: 'https://github.com/Ak33ra/queue-sim'
# cover: './cover.jpg'
# cover_alt: ''
# featured: true
---

An event-driven queue simulator originally written for CMU 15-259 (Probability and Computing), CMU 15-857 (Analytical Performance Modeling and Design of Computer Systems), and later extended with a C++ backend and more configurations.

This tool lets users represent networks and systems with queues abstractly and run an event-driven simulation to gather statistics on response times and queueing delays. 

In queueing terms, the simulator currently supports G/G/k with FCFS, PS, and SRPT scheduling, as well as Jackson networks. Policies and distributions are extensible in both Python and C++.
