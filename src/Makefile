# makefile for flex project

SCANNER_DESC_FILE=scan.l
SCANNER_EXEC_FILE=scan.x

all: $(SCANNER_EXEC_FILE)

$(SCANNER_EXEC_FILE): lex.yy.c
	gcc -o $(SCANNER_EXEC_FILE) lex.yy.c

lex.yy.c: $(SCANNER_DESC_FILE)
	flex -l $(SCANNER_DESC_FILE)

clean:
	rm -f lex.yy.c

rm: clean $(SCANNER_EXEC_FILE)
	rm -fv $(SCANNER_EXEC_FILE)
