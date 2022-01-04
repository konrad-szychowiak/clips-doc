# Writing the docs

## Supported CLIPS constructs

- **rules** via `defrule`
- **templates** via `deftemplate`

## The documentation comment

- clips-doc comments must start with `;;(` and end in `;;)` (each at the beginning of a new line).
- each line in between should start with `;;`
- first thing in a comment should be the description of the code (one-line summary/many lines)
  \[note: _there doesn't have to be a summary, but if there is, it should be first_].
- then there might be several lines with different [tags](#Tags)
- Example: 
    ```clips
    ;;( Sprawdźmy, czy mamy pierwszeństwo przejazdu.
    ;;  @name Pierwszeństwo Przejazdu
    ;;  @see pierwszeństwo
    ;;)
    (defrule drogaZPierwszeństwem
       (and (znaki tak) (typ (kształt zwykłe)))
    => (printout t "Czy droga z pierwszeństwem [tak/nie]? ")
       (assert (pierwszeństwo (read))))
    ```
  
## Tags

### @name

    ;; @name <string...>

Sets a human-readable name to use in the generated documentation. 

```clips
;;( 
;;  @name A to B conversion
;;)
(defrule a2bCnv
    (a) => (assert(b)))
```

### @see
    
    ;; @see <in-code-construct-identifier>

Creates a link to another construct in code. 

```clips
;;( 
;;  @see pierwszeństwo
;;)
(defrule drogaZPierwszeństwem
    ... => ... )
```

### @slot
> `deftemplate` only
> 
> all in one line

    ;; @slot <slot-identifier> <description ...>

Adds description to a slot in the `deftemplate`.

```clips
;;( 
;;  @slot k either r or z
;;)
(deftemplate typ
  (slot k
    (allowed-values r z)
    (default ?NONE))
)
```