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
Conditional statements: 1 represents "true" anything else considered to be "false".
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
Applies a fuction on each elements of a collection:
```
  (block
    (define successor (lambda (n)
      (+ n 1)
    ))
    (printl (map successor (' 1 2 3)))
  )
  
  -> (2 3 4)
```
List opeartions:
``
  (block
    (printl (head (' A B C)))
    (printl (tail (' A B C)))
    (printl (wrap (' A)))
  )
  
  -> A
  -> (B C)
  -> (A)
```
End finally:
```
(block

    (define rotate-left (lambda (L)
        (append (tail L) (wrap (head L)))
    ))

    (define push-to-all (lambda (V LL)
        (map (quote (lambda (l) (push V l)))
         LL)
    ))

    (define permutations-helper (lambda (L R)
        (switch
            (= (length R) 0) (quote)
            (= (length (tail L)) 0) (wrap L)
            1  (append
                   (push-to-all (head L)
                                (permutations-helper (tail L) (tail L)))
                   (permutations-helper (rotate-left L) (tail R)))
        )
    ))

    (define permutations (lambda (L)
        (permutations-helper L L)
    ))

    (printl (permutations (quote A B C)))

)
```
