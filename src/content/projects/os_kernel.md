---
title: 'OS Kernel'
summary: 'Unix-like kernel developed for CMU 15-410, in partnership with Tianyou Zhang.'
role: 'developer'
stack: ['C', 'IA32 Assembly', 'Simics']
start_date: 2026-04-01
end_date: 2026-05-01
featured: true
---

# Overview
Normal coding where your API is the intel isr, arch, and system 
documentation... or something like that. 

This project is usually done in teams of two, and my group's kernel is 
somewhere under 10k lines. 

Anyway, as the name suggests, this project involves implementing a kernel
targeting an IA32 uniprocessor machine. 
That means implementing all the "stuff" needed to load and run multiple 
userspace programs: virtual memory, context switch, synchronization, 
fault handlers, etc. 
The kernel also supports a core set of syscalls, including but not 
limited to:
- allocating and freeing pages
- yield and sleep
- fork
- exec
- spawning new threads
- keyboard IO 
- console display

Those functionalities allow you to run a wide variety of C programs, such as:
- A chess bot 
- Userspace pthreads library
- Game of life
- A monkeytype clone 
- A program that forks and joins thousands of threads (pain++)

I may write more comprehensive posts later on the subjects of conceptual 
material/ lessons/ advice for this class. For now, much of it can be summed 
up as:
1. Be careful. Triple check bitmasks, hand-written assembly, and 
"trivial" pieces of code.
2. Spam asserts/affirms. Cheap ones can and should remain in production code. 
Whenever you know a condition should hold true (or false), assert it.
3. Design first, preferably on a whiteboard with your partner.
4. When debugging, start with the possible causes that are easiest to verify. 
Additionally, remember that debugging is essentially hypothesis testing.
5. Simics is surprisingly expressive. If you want to inspect "X", it can 
probably show you "X".
