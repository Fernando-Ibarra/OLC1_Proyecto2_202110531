export default class TypeD {
    private typeDa: typeData;

    constructor(typeDa: typeData) {
        this.typeDa = typeDa;
    }

    // Getters
    public getTypeData(): typeData {
        return this.typeDa;
    }

    // Setters
    public setTypeData(typeDa: typeData): void {
        this.typeDa = typeDa;
    }
}

// Tipos de datos aceptados por el lenguaje
export enum typeData {
    INT,
    FLOAT,
    BOOL,
    CHAR,
    STRING,
    VOID
}