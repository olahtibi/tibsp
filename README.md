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
Conditional statements treat 1 as true anything else as false.
```
  (if 
    (= 11 (+ 3 (* 2 4))) 1111
    2222
  )
  
  -> 1111
```
One program execution corresponds to one expression evaluation. To chain operation use "block" function.
Use "define" for variable definitions.
```
  (block
    (define PI 3.14)
    (printl PI)
  )
  
  -> 3.14
```
Lambda functions
```
  (block
    (define PI 3.14)
    (define area-of-circle (lambda (radius)
        (* radius radius PI)
    ))
    (area-of-circle 5)
  )
  
  -> 78.5
```
Recursive functions:
```
  (block
    (define factorial (lambda (n) 
      (if 
        (<= n 1) 1 
        (* n (factorial (- n 1)))
      )
    ))
    (factorial 5)
  )
  
  -> 120
```
Applies a fuction on each element of a collection:
```
  (block
    (define successor (lambda (n)
        (+ n 1)
    ))
    (printl (map successor (' 1 2 3)))
  )
  
  -> (2 3 4)
```

