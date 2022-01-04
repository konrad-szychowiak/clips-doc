; (load crossing.clp)
; (assert(start))
; (run)

; (typ rondo | zwykłe)
; (kierujący jest:(tak | nie) zatrzymuje:(tak | nie | unknown))
; (@fact sygnalizacja @arg obecna:(tak | nie) @arg działa:(tak | nie | unknown) @arg zielone:(tak | nie | unknown))
; (znaki są:(tak | nie))
; (pierwszeństwo (tak | nie))
; (prawa-wolna (tak | nie))
; (droga-wolna (tak | nie))


;;( Określa typ skrzyżowania do którego podjeżdżamy.
;;  @name Typ Skrzyżowania
;;  @slot kształt kształt skrzyżowania: rondo albo zwykłe skrzyżowanie
;;)
(deftemplate typ
  (slot kształt
    (allowed-values rondo zwykłe)
    (default ?NONE))
)

;;(
;; (droga wolna:(tak | nie))
;; @name Droga Wolna
;; @slot wolna czy mogę wjechać na skrzyżowanie?
;;)
(deftemplate droga
  (slot wolna
    (allowed-values tak nie)
    (default ?NONE)))


;;(
;; Stwierdza istnienie przeszkody.
;; <p> Przeszkoda może niepozwalać na wiazd na skrzyzowanie. </p>
;; @name PRZESZKODA
;;)
(defrule przeszkoda
  (or
    (kierujący tak tak)
    (sygnalizacja tak tak nie)
    (prawa-wolna nie)
    (droga (wolna nie))
    (and (znaki tak) (typ (kształt rondo)))
    (pierwszeństwo nie)
  )
  =>
  (printout t "PRZESZKODA." crlf)
  (reset))


;;( Stwierdza <b>brak</b> przeszkód.
;;  @name BRAK PRZESZKÓD
;;)
(defrule OK
  (droga (wolna tak))
  =>
  (printout t "BRAK PRZESZKÓD." crlf)
  (reset))


;;(
;; Pyta o typ skrzyżowania.
;; @name Typ (Kształt) Skrzyżowania
;; @see typ
;;)
(defrule typSkrzyżowania
  (start)
  =>
  (printout t "Jaki jest typ skrzyżowania [rondo/zwykłe]? ")
  (assert (typ (kształt (read)))))

;;(
;; Czy jest kierujący ruchem?
;; @see kierujący
;;)
(defrule kierujący
  (typ (kształt ?skrzyżowanie))
  =>
  (printout t "Czy jest kierujący ruchem [tak/nie]? ")
  (assert (kierujący (read) unknown)))


;;( Czy kierujący nakazuje Ci zatrzymanie?
;;  @see kierujący
;;)
(defrule kierującyZatrzymuje
  ?kierujący-tak <- (kierujący tak unknown)
  =>
  (retract ?kierujący-tak)
  (printout t "Czy Cię zatrzymuje [tak/nie]? ")
  (assert (kierujący tak (read))))


;;(
;; Czy są swiatła?
;; @see sygnalizacja
;;)
(defrule swiatła
  (kierujący nie ?arg)
  =>
  (printout t "Czy są swiatła [tak/nie]? ")
  (assert (sygnalizacja (read) unknown unknown)))


;;( @see sygnalizacja
;;)
(defrule awariaŚwiateł
  ?swiatło <- (sygnalizacja tak unknown ?zielone)
  =>
  (retract ?swiatło)
  (printout t "Pulsujące pomarańczowe światło [tak/nie]? ")
  (assert (sygnalizacja tak (read) unknown)))


;;(
;; Czy pali się światło zielone?
;; @see sygnalizacja
;;)
(defrule kolorŚwiatła
  ?swiatło <- (sygnalizacja tak nie unknown)
  =>
  (retract ?swiatło)
  (printout t "Zielone [tak/nie]? ")
  (assert (sygnalizacja tak nie (read))))


(defrule sąZnaki
  (or
    (sygnalizacja nie ?foo ?bar)
    (sygnalizacja tak tak ?baz))
  =>
  (printout t "Czy są znaki regulujące pierwszeństwo [tak/nie]? ")
  (assert (znaki (read))))


(defrule prawaWolna
  (and
    (znaki nie)
    (typ (kształt zwykłe))
  ) =>
  (printout t "Czy prawa jest wolna [tak/nie]? ")
  (assert (prawa-wolna (read))))


;;( Sprawdźmy, czy mamy pierwszeństwo przejazdu.
;;  @name Pierwszeństwo Przejazdu
;;  @see pierwszeństwo
;;)
(defrule drogaZPierwszeństwem
  (and
    (znaki tak)
    (typ (kształt zwykłe))
  ) =>
  (printout t "Czy droga z pierwszeństwem [tak/nie]? ")
  (assert (pierwszeństwo (read))))

;;(
;; Sprawdzamy czy droga wolna.
;;
;; @see droga
;;)
(defrule drogaWolna
  (start)
  =>
  (printout t "Czy możesz zjechać ze skrzyżowania [tak/nie]? ")
  (assert (droga (wolna (read)))))
