---
layout: blog-single
title: Python is single-threaded! Or is it?
date: July 10, 2020
tags: [Python] 
view_url: https://razered.github.io/
---

## Introduction 
There is a lot of misinformation about Python and it's handling of concurrency and parallelism that leads to a lot of confusion for beginners approaching the subject for the first time. Let us first understand what we mean by concurrency and parallelism.

## Concurrency and Parallelism
Concurrent execution means that the start and end times of two or more independent segments of the program overlap. Parallelism means that there is simultaneous computation happening on two or more segments of the code at the same time. Parallelism necessitates the existence of multi-core CPUs or some other kind of redundancy in hardware, while concurrency is a more high level construct that makes no such demand. It follows that parallelism implies concurrency but not vice versa. Look at the illustration below for more clarity.

## CPython, multi-threading and GIL
Which of the two above does Python support? Depends on the implementation. The implementation of your program? No, the implementation of the _language_ itself. Let me explain.

A language by itself is only a specification - syntax and [grammar](https://docs.python.org/3/reference/grammar.html). It does not mandate how it will be converted to machine code at all - via compilation or interpretation or something else. Traditional interpretation, JIT compilation, JIT interpretation and AOT compilation are some of the [choices](https://softwareengineering.stackexchange.com/questions/246094/understanding-the-differences-traditional-interpreter-jit-compiler-jit-interp). These decisions are a part of the _implementation_ of the language. As it turns out, Python has many different implementations with CPython, Jython, PyPy and IronPython being the dominant ones. CPython is the default implementation that Python comes bundled with. Execute the following code on your Python interpreter `import platform; platform.python_implementation()`  to see this for yourself.

Now, CPython has some interesting quirks - the developers decided against allowing multiple threads to use the interpreter _parallely_. This fact is known as the GIL and is lamented by many users of Python - because it leads to threads not being able to leverage multi-core processors and as a result users do not get the speed boost that they get in other languages like Java and C. In practice, the overhead of scheduling the threads on the same processor and managing access to the lock makes multithreading actually _slow_ down your program! So multi-threading loses all value for CPU-bound tasks although it is still useful for IO-bound tasks as the _concurrent_ (but not parallel) execution of threads can help you make the time the program waits on external systems overlap.

## Achieving true parallelism - multiprocessing vs multithreading
One way to achieve speed boosts on CPU-bound programs is through using multiple processes through the `multiprocessing` module available in Python. Why does this not suffer from the same problems as multi-threading? Simple, because each process has it's own GIL. But why do developers lament about GIL if this is a perfectly functional solution? That's because using multiple processes is not _really_ the same as using multiple threads. 
- Threads live in the same memory space whereas all processes have a separate memory space. You can have shared memory between threads but this is not possible for processes. So, in the case of multiprocessing one has to rely on IPC constructs given by the OS or pickling and unpickling objects to share information.
- Threads are often described as as lightweight processes. This means they require fewer resources, are faster to spawn and have a smaller operational overhead. 
- The advantage of multiprocessing is that individual processes are interruptible and killable but the same cannot be said about threads.

These things must be kept in mind before one implements a concurrent solution in Python.