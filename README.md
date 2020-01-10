# tibsp
This is a pure functional programming language similar to LISP.

Demo: https://olahtibi.github.io/tibsp/

The goal of this project is to create a minimal as possible core language that is sufficiently expressive to write libraries in the language itself. The libraries themselves could include their own unit tests.

Example: https://github.com/olahtibi/tibsp/blob/master/tibsp.stdlib.js

## Quick tutorial

```
  (quote "Hello World!")
  
  -> Hello World!
```
"quote" can be replaced by '
```
  (' "Hello World!")
  
  -> Hello World!
```
Arithmetic operations:
```
  (+ 3 (* 2 4))
  
  -> 11
```
Boolean value functions returns 1 for true, 0 for false
```
  (= 11 (+ 3 (* 2 4)))
  
  -> 1
```
```
  (= 15 (+ 3 (* 2 4)))
  
  -> 0
```
Conditional statements treat 1 as true anything else as false and all of them are short circuit
```
  (if 
    (= 11 (+ 3 (* 2 4))) 1111
    2222
  )
  
  -> 1111
```



