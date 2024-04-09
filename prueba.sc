cout << "hola mundo!";
cout<< "sale compi1 \n";
cout << "primer semestre" << endl;
cout << pow(4,2) << endl;

// Relacional -> ==
cout << 1 == 1 << endl; // true
cout << "hola" == "hola" << endl; // true
cout << 25.654 == 54.34 << endl; // false

// Relacional -> !=
cout << 1 != 2 << endl; // true
// cout << var1 != var2 << endl;
cout << 50 != 30 << endl; // true

// Relacional -> <
cout << 25.5 < 30 << endl; // true
cout << 54 < 25  << endl; // false
cout << 50 < 'F' << endl;  // false

// Relacional -> <=
cout << 25.5 <= 30 << endl; // true
cout << 54 <= 25  << endl; // false
cout << 50 <= 'F' << endl; // false


// Relacional -> >
cout << 25.5 > 30 << endl; // false
cout << 54 > 25  << endl; // true
cout << 50 > 'F' << endl;  // true

// Relacional -> >=
cout << 25.5 >= 30 << endl; // false
cout << 54 >= 25  << endl; // true
cout << 50 >= 'F' << endl; // true

// Logicas
cout << true && "hola" == "hola" << endl;
cout << true || 5<2 << endl;
cout << !true << endl;

string var1, var2 = "hola";
cout << toupper(var1) << endl;

var2 = "PRUEBA2";
cout << tolower(var2) << endl;

double prevVar = 10.50;
cout << prevVar << endl;

int varChange = (int) prevVar;
cout << varChange << endl;

int varChange2 = (int) 134.50;
cout << varChange2 << endl;

char letra = (char) 70; // toma el valor 'F' ya que el 70 en ascii es F 
cout << letra << endl; 

double numero = (double) 16; // toma el valor de 16.0
cout << numero << endl;

double valor = 15.51; 
cout << round(valor) << endl; //almacena 16
double valor2 = 9.40;
cout << round(valor2) << endl; //almacena 9