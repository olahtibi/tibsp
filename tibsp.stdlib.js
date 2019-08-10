try {
    tibsp.run(`
    
        (block
                
            (define assert (lambda (actual expected errorMsg)
                (if (= actual expected)
                    1
                    (throw (cat 
                        errorMsg 
                        (quote ": actual: ") 
                        actual
                        (quote ": expected: ") 
                        expected
                    ))
                )
            ))

            (define map (lambda (func L)
                (if (= 1 (length L))
                  (wrap (apply func (head L)))
                  (push
                    (apply func (head L))
                    (map func (tail L))
                  )
                )
            ))

            (define plus2 (lambda (n) (+ n 2)))
            (define fact (lambda (n) (if (<= n 1) 1 (* n (fact (- n 1))))))			
            
            (assert 
                (fact 5)
                120
                (quote "stdlib: recursive function calls are broken")
            )
            
            (assert 
                (apply (quote +) 1 2 3 4)
                10
                (quote "stdlib: apply command: should work with literals and builtin function")
            )
            (assert 
                (apply (quote plus2) (+ 10 3))
                15
                (quote "stdlib: apply command: should work when argument is an expression")
            )
            (assert 
                (apply (quote (lambda (n) (+ n 4))) (+ 10 3))
                17
                (quote "stdlib: apply command: should work when argument is an expression and function is a lambda")
            )	  		
            (assert 
                (map (quote plus2) (quote 5 10 15 20))
                (quote 7 12 17 22)
                (quote "stdlib: map: should work on literal list with named function")
            )
            (assert 
                (map (quote (lambda (n) (+ n 4))) (quote 5 10 15 20))
                (quote 9 14 19 24)
                (quote "stdlib: map: should work on literal list with lambda")
            )
            (assert 
                (head (map (quote (lambda (n) (+ n 4))) (wrap (+ 5 10))))
                19
                (quote "stdlib: map: should work on expression with lambda")
            )
            (assert 
                (length (quote 7 6 5))
                3
                (quote "stdlib: length: should return length of list")
            )
            (assert 
                (length (wrap (' A A A)))
                1
                (quote "stdlib: length: should return length of wrapped list")
            )
            (assert
                (push 1 (' 2 3 4))
                (quote 1 2 3 4)
                (quote "stdlib: push: should add element to the head of the list")
            )

        )		
    `);
}
catch (e) {
    printLineC('red', e);
}
