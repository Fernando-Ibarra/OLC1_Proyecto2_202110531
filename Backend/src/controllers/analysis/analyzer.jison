%{
    const TypeD = require('./symbols/TypeD');
    const Aritmeticas = require('./expressions/Aritmeticas');
    const Nativo = require('./expressions/Nativo');
    const Cout = require('./instructions/Cout');
%}

// Lexical analysis

%lex
%options case-insensitive

%% 

// reserved words
"cout"                  return  'COUT'
"pow"                   return  'POW'
"endl"                  return  'ENDL'

// symbols
";"                     return  "SEMICOLON"
","                     return  "COMMA"
"+"                     return  "PLUS"
"-"                     return  "MINUS"
"*"                     return  "TIMES"
"/"                     return  "DIVIDE"
"%"                     return  "MOD"
"("                     return  "LPAREN"
")"                     return  "RPAREN"
"<<"                   return  "DOUBLE_QUOTE"
(-)?[0-9]+"."[0-9]+     return  "FLOAT"
(-)?[0-9]+              return  "INTEGER"
[\"][^\"]*[\"]          {yytext=yytext.substr(1,yyleng-2); return 'STRING'}

// whitespacethu
[\ \r\t\f\t]+    /* ignore */    {}
[\ \n]           /* ignore */    {}

// End of File
<<EOF>>         return "EOF"

%{

%}

/lex

// precedence
%left 'PLUS' 'MINUS'
%left 'TIMES' 'DIVIDE'
%left 'MOD'
%right UMINUS


// start symbol
%start INIT

%%

INIT: INSTRUCTIONS EOF                                      { return $1; }
;

INSTRUCTIONS: INSTRUCTIONS INSTRUCTION                      { $1.push($2); $$= $1; }
            | INSTRUCTION                                   { $$ = [$1]; }
;

INSTRUCTION: PRINT SEMICOLON                                { $$ = $1; }
;

PRINT: COUT DOUBLE_QUOTE EXPRESSION                         { $$ = new Cout.default($3, @1.first_line, @1.first_column, false); }
     | COUT DOUBLE_QUOTE EXPRESSION DOUBLE_QUOTE ENDL       { $$ = new Cout.default($3, @1.first_line, @1.first_column, true); }
;

EXPRESSION: EXPRESSION PLUS EXPRESSION                      { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.PLUS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION MINUS EXPRESSION                     { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.MINUS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION TIMES EXPRESSION                     { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.TIMES, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION DIVIDE EXPRESSION                    { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.DIV, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION MOD EXPRESSION                       { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.MOD, @1.first_line, @1.first_column, $1, $3);}
          | POW LPAREN EXPRESSION COMMA EXPRESSION RPAREN   { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.POWER, @1.first_line, @1.first_column, $3, $5);}
          | LPAREN EXPRESSION RPAREN                        { $$ = $2; }
          | MINUS EXPRESSION %prec UMINUS                   { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.NEGATIVE, @1.first_line, @1.first_column, $2); }
          | INTEGER                                         { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.INT), $1, @1.first_line, @1.first_column); }
          | FLOAT                                           { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.FLOAT), $1, @1.first_line, @1.first_column); }
          | STRING                                          { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.STRING), $1, @1.first_line, @1.first_column);}
;