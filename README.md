# clips-doc

## Installation
Download the `clips-doc.docker.tar` Docker image. You will need docker to proceed.

```bash
docker load --input clips-doc.docker.tar
```

Image tag will be `clips-doc` or `clips-doc:latest`.

## Usage
- Assuming your working directory is `$workdir`.
- Create a directory docs.
- Copy a chosen CLIPS file ($clipsfile) to `docs/` as `in.clp`

```bash
mkdir /docs
cp $workdir/$clipsfile $workdir/docs/in.clp
docker run -v $workdir/docs:/app/com clips-doc
# optionally
cp $workdir/docs/out.html $workdir/$clipsfile.html
```
- a file `out.html` will be created in `$workdir/docs/`—that's the documentation of the `$clipsfile`

## Comment

```clips
;;( Określa typ skrzyżowania do którego podjeżdżamy.
;;  @name Typ Skrzyżowania
;;  @slot kształt kształt skrzyżowania: rondo albo zwykłe skrzyżowanie
;;  @see drogaZPierwszeństwem
;;)
(deftemplate typ
  (slot kształt
    (allowed-values rondo zwykłe)
    (default ?NONE))
)
```

```clips
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
```

## Contributing
> Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
>
> Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
