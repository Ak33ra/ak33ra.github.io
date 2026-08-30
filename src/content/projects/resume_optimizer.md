---
title: 'Agentic Resume Optimizer'
summary: 'Orchestrates a CLI agent to run a scored resume optimization loop, inspired by autoresearch.'
category: side
role: 'author'
stack: ['Python']
start_date: 2026-07-15
end_date: 2026-07-16        # optional; omit for ongoing
links:
  - label: 'GitHub'
    url: 'https://github.com/Ak33ra/resume-optimizer'
# cover: './cover.jpg'
# cover_alt: ''
featured: true
---

# Overview
Inspired by Karpathy's autoresearch (and not wanting to manually create a 
resume/cv for each new application), I developed this simple harness that 
turns your AI agent into a resume creating machine. 

The idea is simple: populate your target job descriptions and supply source 
material which would normally go into a resume (projects, experience, etc.), 
then have the agent iterate on targeted resumes for each application.

Through the harness, the agent conducts resume optimization in rounds. In each 
round, it drafts a new candidate resume to compare to the current best. Through 
the harness, it verifies the accuracy of all bullets, ensures formatting 
constraints (e.g. 1 page pdf) are respected, scores ATS scannability, and 
has its work graded by as many CLI agents as you have available (claude, codex, 
gemini, etc.). If the new resume is sufficiently better, the change is accepted 
and committed, else reverted, with all hypotheses and results logged for future 
agents. 

What a great way to burn tokens! (Developing this project may or may not have 
also been a way to use free tokens...)

# Ok, does it work? 
Good question. I was also skeptical since resume creation is a pretty 
trivial task. I looked into a few things:
1. Does the round-based optimization actually help?
2. How dependent is performance on model quality?

I think we probably have the same hypothesis. Though I made this repo, I 
didn't think round-based optimization would help, and the results would be 
strongly dependent on the model. The reason is that resume creation is a 
simple task with a small hypothesis space, and a pretty clear cut set of 
"rules": include quantifiers, use relevant experience and projects, make 
sure it's decently readable. After doing that, maybe you can try reordering 
stuff, but it doesn't matter too much. A stronger model should help by being 
able to reason through the provided source material and evaluate it w.r.t. 
the job description. To be more precise, I think longer reasoning and better 
recall capability would be the dominant factors.

For experiment 1, we can simply measure how much the resume improves each 
round. For this, I used Claude Opus 4.8 and Claude Sonnet (I forget the 
version), with identical and independent starting environments, with a 
pretty sad base resume. As a human, I would've changed the ordering of bullets 
in that resume, as well as added in missing quantifiers and extra experience 
from my source material. 

Opus 4.8 had very strong improvements, increasing the LLM panel score from ~50 
to ~85 out of 100 in the first round. However, the subsequent 3 rounds all 
failed to produce a better resume. 

Sonnet actually straight up failed to improve on the resume, even in the first 
round, which also answers the 2nd question. Big shocker, a stronger model did 
better. Wow.

So yeah, when it came to improvement, a simple task like resume creation
doesn't benefit much from an autoresearch-like 
setup. At this point, I was going to just delete the repo, but I thought I'd 
evaluate it versus an unharnessed baseline as well. 

## Harness vs no harness 
In terms of overall score, averaged across a few independent attempts, neither 
Opus 4.8 nor Sonnet benefitted from being ran for one round with the harness.
This should be obvious, since the point is improvement over multiple rounds 
and the ability to test hypotheses in a structured manner. A one shot 
attempt should be about the same either way.

However, the repo did produce a different benefit: it enforced the accuracy 
of all information, as well as ensured the output respected formatting rules. 
The unharnessed agents, 
even Opus, fabricated or "inferred" details and consistently produced a 
pdf longer than a page. 

# Recommended use
First, make sure to follow recommended privacy guidelines (basically make a 
private fork) to ensure your personal material doesn't get pushed to github.

Given the above experiments, I think the main reason to use this is to 
get quick revisions targeting specific job postings, which can be accomplished 
with only one or two optimization rounds. Even if you only have a resume 
to provide as source material, the agent can ask for extra facts you 
may be able to provide, or otherwise change wording/ formatting for ATS.
In my opinion, it beats using a regular chat session precisely because it 
prevents hallucinations and formatting issues you'd otherwise need to fix 
yourself.

Of course, manually read everything over and make tweaks like normal. LLMs 
talk strangely sometimes.

If you try this, let me know how it goes!
