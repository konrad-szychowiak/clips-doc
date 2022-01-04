FROM alpine as builder

RUN apk add gcc musl-dev libc-dev make flex

WORKDIR /build/
COPY src/Makefile Makefile
COPY src/scan.l scan.l

RUN make

RUN ls -la

FROM node:alpine

COPY --from=builder /build/scan.x /app/scan.x
COPY src/main.js /app/clips-doc.js
COPY src/clips-doc.sh /app/clips-doc

WORKDIR /app
RUN mkdir "out"
RUN ls -la

CMD ["sh", "clips-doc", "./in.clp", "./out/out.html"]
