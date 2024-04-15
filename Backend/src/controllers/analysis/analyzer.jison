%{
    const TypeD = require('./symbols/TypeD');

    const Aritmeticas = require('./expressions/Aritmeticas');
    const Nativo = require('./expressions/Nativo');
    const AccessVar = require('./expressions/AccessVar');
    const Relacionales = require('./expressions/Relacionales');
    const Logicas = require('./expressions/Logicas');

    const Cout = require('./instructions/Cout');
    const AssigneVar = require('./instructions/AssigneVar');
    const Declaration = require('./instructions/Declaration');
    const AssigneArr = require('./instructions/AssigneArr');
    const DeclarationArr = require('./instructions/DeclarationArr');
    const Casts = require('./instructions/Casts');
    const ToLower = require('./instructions/ToLower');
    const ToUpper = require('./instructions/ToUpper');
    const Round = require('./instructions/Round');
    const ToString = require('./instructions/ToString');
    const If = require('./instructions/If');
    const For = require('./instructions/For')
    const While = require('./instructions/While')
    const DoWhile = require('./instructions/DoWhile')
    const Break = require('./instructions/Break');
    const Return = require('./instructions/Return');
    const Continue = require('./instructions/Continue');
    const Increment = require('./instructions/Increment');
    const Decrement = require('./instructions/Decrement');
    const Ternary = require('./instructions/Ternary');
%}

// Lexical analysis

%lex
%options case-insensitive

%%

// Coments
[/][/].*[\n]    /* ignore */    {}
[/][*][^*]*[*]+([^*/][^*]*[*]+)*[/]    /* ignore */    {}

// reserved words
"int"                   return  'INT_TYPE'
"double"                return  'DOUBLE_TYPE'
"char"                  return  'CHAR_TYPE'
"string"                return  'STRING_TYPE'
"bool"                  return  'BOOL_TYPE'
"pow"                   return  'POW'
"cout"                  return  'COUT'
"new"                   return  'NEW'
"std"                   return  'STD'
"endl"                  return  'ENDL'
"if"                    return  'IF'
"else"                  return  'ELSE'
"switch"                return  'SWITCH'
"case"                  return  'CASE'
"while"                 return  'WHILE'
"do"                    return  'DO'
"for"                   return  'FOR'
"break"                 return  'BREAK'
"continue"              return  'CONTINUE'
"return"                return  'RETURN'
"void"                  return  'VOID'
"tolower"               return  'TOLOWER'
"toupper"               return  'TOUPPER'
"round"                 return  'ROUND'
"length"                return  'LENGTH'
"typeof"                return  'TYPEOF'
"tostring"              return  'TOSTRING'
"c_str"                 return  'C_STR'
"execute"               return  'EXECUTE'
"<<"                    return  "DOUBLE_QUOTE"

// arithmetic operators
"+"                     return  "PLUS"
"-"                     return  "MINUS"
"*"                     return  "TIMES"
"/"                     return  "DIVIDE"
"%"                     return  "MOD"

// relational operators
"=="                    return  "EQUALS"
"!="                    return  "DIFFERENT"
"<="                    return  "LESS_EQUAL"
"<"                     return  "LESS"
">="                    return  "GREATER_EQUAL"
">"                     return  "GREATER"

// logical operators
"||"                    return  "OR"
"&&"                    return  "AND"
"!"                     return  "NOT"

// ternary operator
"?"                     return  "INTERROGATION"
":"                     return  "COLON"

// symbols
";"                     return  "SEMICOLON"
","                     return  "COMMA"
"("                     return  "LPAREN"
")"                     return  "RPAREN"
"{"                     return  "LBRACE"
"}"                     return  "RBRACE"
"["                     return  "LBRACKET"
"]"                     return  "RBRACKET"
"="                     return  "ASSIGN"

// types
(-)?[0-9]+"."[0-9]+     return  "FLOAT"
(-)?[0-9]+              return  "INTEGER"
"true"                  return  "TRUE"
"false"                 return  "FALSE"
[a-z][a-z0-9_]*         return  "ID"
[\'][^\'][\']           return  "CHAR"
[\"][^\"]*[\"]          {yytext=yytext.substr(1,yyleng-2); return 'STRING'}

// whitespace
[\ \r\t\f\t]+    /* ignore */    {}
[\ \n]           /* ignore */    {}

// End of File
<<EOF>>         return "EOF"

.               return "UNEXPECTED_TOKEN"

%{

%}

/lex

// precedence
%left 'OR'
%left 'AND'
%left 'EQUALS' 'DIFFERENT' 'LESS' 'LESS_EQUAL' 'GREATER' 'GREATER_EQUAL' 
%left 'PLUS' 'MINUS'
%left 'DIVIDE' 'TIMES' 'MOD'
%nonassoc 'POW'
%right 'INCREMENT' 'DECREMENT'
%right 'LPAREN'
%right 'UMINUS'
%right 'NOT'


// start symbol
%start INIT

%%

INIT: INSTRUCTIONS EOF                                      { return $1; }
;

INSTRUCTIONS: INSTRUCTIONS INSTRUCTION                      { $1.push($2); $$= $1; }
            | INSTRUCTION                                   { $$ = [$1]; }
;

INSTRUCTION: PRINT SEMICOLON                                 { $$ = $1; }
           | DECLARATION SEMICOLON                           { $$ = $1; }
           | ASSINGNEW SEMICOLON                             { $$ = $1; }
           | ARRAY SEMICOLON                                 { $$ = $1; }
           | INCREMENT SEMICOLON                             { $$ = $1; }
           | DECREMENT SEMICOLON                             { $$ = $1; }
           | IF_S                                            { $$ = $1; }
           | WHILE_S                                         { $$ = $1; }
           | DoWhile                                         { $$ = $1; }
           | FOR_S                                           { $$ = $1; }
           | BREAK_S                                         { $$ = $1; }
           | CONTINUE_S                                      { $$ = $1; }
           | RETURN_S                                        { $$ = $1; }
;

PRINT: COUT DOUBLE_QUOTE EXPRESSION                         { $$ = new Cout.default($3, @1.first_line, @1.first_column, false); }
     | COUT DOUBLE_QUOTE EXPRESSION DOUBLE_QUOTE ENDL       { $$ = new Cout.default($3, @1.first_line, @1.first_column, true); }
;

DECLARATION: TYPES IDS ASSIGN EXPRESSION                         { $$ = new Declaration.default($1, @1.first_line, @1.first_column, $2, $4); }
           | TYPES IDS                                           { $$ = new Declaration.default($1, @1.first_line, @1.first_column, $2); }
;

ASSINGNEW: IDS ASSIGN EXPRESSION                             { $$ = new AssigneVar.default($1, @1.first_line, @1.first_column, $3); }
         | IDS                                               { $$ = new AssigneVar.default($1, @1.first_line, @1.first_column, $3); }
;

IDS: IDS COMMA ID                                           { $1.push($3); $$ = $1;}
   | ID                                                     { $$ = [$1]; }
;

IF_S: IF LPAREN EXPRESSION RPAREN LBRACE INSTRUCTIONS RBRACE                                    { $$ = new If.default($3, $6, @1.first_line, @1.first_column, false); }
    | IF LPAREN EXPRESSION RPAREN LBRACE INSTRUCTIONS RBRACE ELSE LBRACE INSTRUCTIONS RBRACE    { $$ = new If.default($3, $6, @1.first_line, @1.first_column, true, $10); }
    | IF LPAREN EXPRESSION RPAREN LBRACE INSTRUCTIONS RBRACE ELSE IF_S                          { $$ = new If.default($3, $6, @1.first_line, @1.first_column, false); }
;

FOR_S: FOR LPAREN FOR_S_DE SEMICOLON EXPRESSION SEMICOLON FOR_S_UPD RPAREN LBRACE INSTRUCTIONS RBRACE { $$ = new For.default($3, $5, $7, $10, @1.first_line, @1.first_column); }
;

FOR_S_DE: DECLARATION { $$ = $1; }
        | ASSINGNEW   { $$ = $1; }
;

FOR_S_UPD: INCREMENT { $$ = $1; }
         | DECREMENT { $$ = $1; }
         | ASSINGNEW { $$ = $1; }
;

WHILE_S: WHILE LPAREN EXPRESSION RPAREN LBRACE INSTRUCTIONS RBRACE  { $$ = new While.default($3, $6, @1.first_line, @1.first_column); }
;

DoWhile: DO LBRACE INSTRUCTIONS RBRACE WHILE LPAREN EXPRESSION RPAREN { $$ = new DoWhile.default($7, $3, @1.first_line, @1.first_column); }
;

BREAK_S: BREAK  SEMICOLON                                { $$ = new Break.default(@1.first_line, @1.first_column); }
;

CONTINUE_S: CONTINUE  SEMICOLON                          { $$ = new Continue.default(@1.first_line, @1.first_column); }
;

RETURN_S: RETURN  SEMICOLON                              { $$ = new Return.default(@1.first_line, @1.first_column); }
        | RETURN EXPRESSION SEMICOLON                    { $$ = new Return.default(@1.first_line, @1.first_column, $2); }
;

ARRAY: TYPES IDS ARRAYBRACKET ASSIGN NEW TYPES EXPRESSION            { $$ = new DeclarationArr.default($1, $2, $7, @1.first_line, @1.first_column); }
     | TYPES IDS ARRAYBRACKET ASSIGN EXPRESSION                      { $$ = new DeclarationArr.default($1, $2, $5, @1.first_line, @1.first_column); }
;

ASSINGARRAY: IDS EXPRESSION                             { $$ = new AssigneArr.default($1, $2, @1.first_line, @1.first_column); }
;

ARRAYBRACKET: ARRAYBRACKET LBRACKET RBRACKET            { $$ = $1; }
            | LBRACKET RBRACKET                         { $$ = []; }
;

INCREMENT: IDS PLUS PLUS                                  { $$ = new Increment.default($1, @1.first_line, @1.first_column); }
;

DECREMENT: IDS MINUS MINUS                                { $$ = new Decrement.default($1, @1.first_line, @1.first_column); }
;

EXPRESSION: EXPRESSION PLUS EXPRESSION                      { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.PLUS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION MINUS EXPRESSION                     { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.MINUS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION TIMES EXPRESSION                     { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.TIMES, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION DIVIDE EXPRESSION                    { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.DIV, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION MOD EXPRESSION                       { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.MOD, @1.first_line, @1.first_column, $1, $3);}
          | MINUS EXPRESSION %prec UMINUS                   { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.NEGATIVE, @1.first_line, @1.first_column, $2); }
          | POW LPAREN EXPRESSION COMMA EXPRESSION RPAREN   { $$ = new Aritmeticas.default(Aritmeticas.ArithmeticOption.POWER, @1.first_line, @1.first_column, $3, $5);}
          | EXPRESSION EQUALS EXPRESSION                    { $$ = new Relacionales.default(Relacionales.RelationalOption.EQUALS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION DIFFERENT EXPRESSION                 { $$ = new Relacionales.default(Relacionales.RelationalOption.DIFFERENT, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION LESS EXPRESSION                      { $$ = new Relacionales.default(Relacionales.RelationalOption.LESS, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION GREATER EXPRESSION                   { $$ = new Relacionales.default(Relacionales.RelationalOption.GREATER, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION LESS_EQUAL EXPRESSION                { $$ = new Relacionales.default(Relacionales.RelationalOption.LESS_EQUAL, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION GREATER_EQUAL EXPRESSION             { $$ = new Relacionales.default(Relacionales.RelationalOption.GREATER_EQUAL, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION OR EXPRESSION                        { $$ = new Logicas.default(Logicas.LogicasOption.OR, @1.first_line, @1.first_column, $1, $3);}
          | EXPRESSION AND EXPRESSION                       { $$ = new Logicas.default(Logicas.LogicasOption.AND, @1.first_line, @1.first_column, $1, $3);}
          | NOT EXPRESSION                                  { $$ = new Logicas.default(Logicas.LogicasOption.NOT, @1.first_line, @1.first_column, $2);}
          | LPAREN EXPRESSION RPAREN                        { $$ = $2; }
          | LPAREN TYPES RPAREN EXPRESSION                  { $$ = new Casts.default($2, $4, @1.first_line, @1.first_column); }
          | INTEGER                                         { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.INT), $1, @1.first_line, @1.first_column); }
          | FLOAT                                           { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.FLOAT), $1, @1.first_line, @1.first_column); }
          | STRING                                          { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.STRING), $1, @1.first_line, @1.first_column);}
          | TRUE                                            { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.BOOL), $1, @1.first_line, @1.first_column); }
          | FALSE                                           { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.BOOL), $1, @1.first_line, @1.first_column); }
          | CHAR                                            { $$ = new Nativo.default(new TypeD.default(TypeD.typeData.CHAR), $1, @1.first_line, @1.first_column); }
          | ID                                              { $$ = new AccessVar.default($1, @1.first_line, @1.first_column); }
          | TOLOWER LPAREN EXPRESSION RPAREN                { $$ = new ToLower.default($3, @1.first_line, @1.first_column); }
          | TOUPPER LPAREN EXPRESSION RPAREN                { $$ = new ToUpper.default($3, @1.first_line, @1.first_column); }
          | ROUND LPAREN EXPRESSION RPAREN                  { $$ = new Round.default($3, @1.first_line, @1.first_column); }
          | STD COLON COLON TOSTRING LPAREN EXPRESSION RPAREN               { $$ = new ToString.default($6, @1.first_line, @1.first_column); }
          | LISTF                                           { $$ = $1; }
          | LPAREN EXPRESSION RPAREN INTERROGATION EXPRESSION COLON EXPRESSION { $$ = new Ternary.default($2, $5, $7, @1.first_line, @1.first_column); }
          // | LISTACCES                                      { $$ = $1; }
;

LIST: LIST COMMA EXPRESSION                               { $1.push($3); $$ = $1; }
    | EXPRESSION                                          { $$ = [$1]; }
;

LISTF: LISTF LBRACKET LIST RBRACKET       { $1.push($3); $$ = $1; }
     | LBRACKET LIST RBRACKET                 { $$ = [$2]; }
;

TYPES : INT_TYPE                        {$$ = new TypeD.default(TypeD.typeData.INT);}
      | DOUBLE_TYPE                     {$$ = new TypeD.default(TypeD.typeData.FLOAT);}
      | STD COLON COLON STRING_TYPE     {$$ = new TypeD.default(TypeD.typeData.STRING);}
      | CHAR_TYPE                       {$$ = new TypeD.default(TypeD.typeData.CHAR);}
      | BOOL_TYPE                       {$$ = new TypeD.default(TypeD.typeData.BOOL);}
;