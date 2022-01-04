%{
  #include <stdio.h>
  int yywrap(void);
  int yylex(void);
%}

%s tag
%s doc
%s src
%s construct
ident  [a-zA-Z][ĘęÓóĄąŁłŻżŹźĆćŃńŚśa-zA-Z_\-\?0-9]*

%%
%{
  int brackets = 0;
  int identified = 0;
  // printf("[");
%}

%{
  // /* <arg>"|"                { printf(","); } */
  // /* <assert>[\s]            { printf("\"args\": [ "); BEGIN arg; } */
  // /*  */
  //
  // <ruleArg>"|"              { printf(","); }
  // <ruleArg>[\ ]+            { printf("],["); }
  // <ruleArg>")"              { BEGIN doc; }
  // <ruleArg>{ident}          { printf(""); }
  // <ruleArg>{ident}"|"       { printf("<arg><arg-opt>"); ECHO; }
  // <rule>[\ ]                ;
  // <rule>{ident}             { printf("<name>"); ECHO; printf("</name>"); BEGIN ruleArg; }
  // <assert>[\ ]*"("          { BEGIN rule; }
  // <assert>\n                  { printf("\n"); BEGIN doc; }
%}
<src>\n                     ;
<src>")"                    { brackets--;
                              if(brackets == 0){ printf(";\n"); BEGIN INITIAL; }
                              else { ECHO; } }
<src>"("                    { ECHO; brackets++; }
<tag>\n                     { BEGIN doc; }
<tag>"name"                 { printf("DISPLAY_NAME "); }
<tag>"slot"                 { printf("SLOT_REF "); }
<tag>"see"                  { printf("SEE "); }
<INITIAL,construct>"(defrule"       { printf("RULE "); }
<INITIAL,construct>"(deftemplate"   { printf("TEMPLATE "); }
<construct>{ident}          { ECHO; printf("\nSRC ");
                              brackets = 1;
                              BEGIN src;}
<doc>@                      { printf("\n"); BEGIN tag; }
<doc>\n                     { printf(" "); }
<doc>";;"                   ;
<doc>";;)"                  { BEGIN construct; }
<INITIAL>";;("              { printf("DOC"); BEGIN doc; }
<INITIAL>.|\n               ;

%%

int yywrap(void) { return 1; }
int main(void) { return yylex(); }
