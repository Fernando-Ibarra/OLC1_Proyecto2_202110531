"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeData = exports.TypeD = void 0;
class TypeD {
    constructor(typeDa) {
        this.typeDa = typeDa;
    }
    // Getters
    getTypeData() {
        return this.typeDa;
    }
    // Setters
    setTypeData(typeDa) {
        this.typeDa = typeDa;
    }
}
exports.TypeD = TypeD;
// Tipos de datos aceptados por el lenguaje
var typeData;
(function (typeData) {
    typeData[typeData["INT"] = 0] = "INT";
    typeData[typeData["FLOAT"] = 1] = "FLOAT";
    typeData[typeData["BOOL"] = 2] = "BOOL";
    typeData[typeData["CHAR"] = 3] = "CHAR";
    typeData[typeData["STRING"] = 4] = "STRING";
    typeData[typeData["VOID"] = 5] = "VOID";
})(typeData || (exports.typeData = typeData = {}));
