%{
    const TypeD = require('./symbols/TypeD');
    const Aritmeticas = require('./expressions/Aritmeticas');
    const Nativo = require('./expressions/Nativo');
%}

// Lexical analysis

%lex
%options case-insensitive

%% 

// reserved words


// symbols
";"             return "SEMICOLON"
","             return "COMMA"
"+"             return "PLUS"
"-"             return "MINUS"
"*"             return "TIMES"
"/"             return "DIVIDE"
"("             return "LPAREN"
")"             return "RPAREN"
(-)?[0-9]+"."[0-9]+ return "FLOAT"
(-)?[0-9]+          return "INTEGER"


// whitespace
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
%right UMINUS


// start symbol
%start INIT

%%

INIT: INSTRUCTIONS EOF                     { return $1; }
;

INSTRUCTIONS: INSTRUCTIONS INSTRUCTION      { $1.push($2); $$= $1; }
            | INSTRUCTION                   { $$ = [$1]; }
;

INSTRUCTION: EXPRESSION SEMICOLON           { $$ = $1; }
;

EXPRESSION: EXPRESSION PLUS EXPRESSION      { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.PLUS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION MINUS EXPRESSION     { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.MINUS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION TIMES EXPRESSION     { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.TIMES, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION DIVIDE EXPRESSION    { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.DIV, @1.first_line, @1.first_column, $1, $3);}
          | LPAREN EXPRESSION RPAREN        { $$ = $2; }
          | MINUS EXPRESSION %prec UMINUS   { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.NEGATIVE, @1.first_line, @1.first_column, $2); }
          | INTEGER                         { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.INT), $1, @1.first_line, @1.first_column); }
          | FLOAT                           { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.FLOAT), $1, @1.first_line, @1.first_column); }
;