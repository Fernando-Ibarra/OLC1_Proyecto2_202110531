# MANUAL TÉCNICO - CompiScript+

En el presente manual se busca explicar el funcionamiento del interprete creado.

## Índice
1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Concepto](#concepto)
4. [Aplicación](#aplicacion)
5. [Autor](#autor)

## Introducción
El interprete creado, CompiScript+, es un lenguaje de programación que permite la ejecución de scripts en un entorno de consola. Este interprete permite la creación de variables, la ejecución de operaciones aritméticas, la creación de funciones, la ejecución de condicionales y ciclos, entre otras cosas.

## Instalación
Para instalr el proyecto, se debe clonar el actual repositorio, el proyecto esta separado en dos carpetas:

**Backend**: También llamado servidor, es donde se encuentra nuestro interprete. Para ejecutar se deben seguir los siguientes comandos:
```bash
cd Backend

npm install

npm run build

npm run jison

npm run start

```
 

**Frontend**: Conocido como cliente, es donde se encuentra nuestra parte "visual" o lo que ve el cliente, de ahí el nombre. Los comandos a seguir son:
```bash
cd Frontend

yarn install

yarn dev

```

## Concepto
Un patrón de diseño es una solución general reutilizable a un problema comúnmente ocurrido dentro de un contexto dado en el diseño de software. No es un diseño finalizado que puede ser transformado directamente en código. Es una descripción o plantilla para cómo resolver un problema que puede ser utilizada en muchas situaciones diferentes. 

Los patrones de diseño pueden acelerar el proceso de desarrollo al proporcionar paradigmas de desarrollo probados y eficientes. Los patrones de diseño pueden ser mejorados con el tiempo y pueden proporcionar un método para reutilizar código eficazmente, lo que facilita la comunicación entre los diseñadores.

En este proyecto, para la realizacion del interprete se recurrio a la utilización de uno. En este caso, el patrón **_interprete_**

### Patron Interprete
describe cómo definir una gramática para lenguajes simples, representan los oraciones en la lengua, e interpretan estas oraciones.

Este patrón utiliza clases para representar reglas gramaticales:
- **Expresión Abstracta**: Declara una operación _abstrat Interpret_ que es común a todos los nodos en el árbol de sintaxis abstracta
- **Terminal Abstracto**: Ejecuta una operación integrada asociada a los simbolos terminales de la gramatica
- **No Terminal Abstracta**: Mantiene variables de instancia de tipo expresión abstracta para cada una de los símbolos gramaticales.
- **Contexto**: Contiene información global para el interprete

## Aplicación
En la carpeta `src/controllers/analysis` se ubican la archivos que utlizara el programa.

- Abstract: contiene la clase abstracta `Instruction`, que es de la cual extienden todas las que se utilizan.

- Exception: Contiene el archivo con la clase errores.

- Expressions: Contiene las clases, que generarán un valor

- Instruction: Contiene las clases, que operaran o ejecutaran según la expression que tengan.

- Symbols: Contiene todo lo relacionado al contexto/ambiente del programa.


## Autor
Enrique Fernando Gaitán Ibarra