# clips-doc

## Writing the docs

- [guide](guide.md)

## Using clips-doc

### Installation
Download the `clips-doc.docker.tar` Docker image. You will need docker to proceed.

```bash
docker load --input clips-doc.docker.tar
```

Image tag will be `clips-doc` or `clips-doc:latest`.

### Usage
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

## License
[MIT](https://choosealicense.com/licenses/mit/)
