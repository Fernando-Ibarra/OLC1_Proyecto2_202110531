import { Error, Instruction, Symbol, SymbolTable, Tree } from '../';
import TypeD, { typeData } from '../symbols/TypeD';

export default class Casts extends Instruction {
    private expression: Instruction ;

    constructor(newType: TypeD, expression: Instruction, row: number, column: number) {
        super(newType, row, column)
        this.expression = expression
    }

    interpret(tree: Tree, table: SymbolTable) {
        let exp = this.expression.interpret(tree, table)
        if (exp instanceof Error) return exp

        if (exp == null) return new Error('Semantico', `La variable ${exp} no existe`, this.row, this.column);
                
        switch (this.typeData.getTypeData()) {
            case typeData.INT:
                return this.intCasts(exp)
            case typeData.FLOAT:
                return this.floatCasts(exp)
            case typeData.CHAR:
                return this.charCasts(exp)
            default:
                return new Error('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column)
        }

    }

        intCasts(exp: any){
            let typeExpression = this.expression.typeData.getTypeData()
            switch (typeExpression) {
                case typeData.FLOAT:
                    this.typeData = new TypeD(typeData.INT);
                    return parseInt(exp)
                case typeData.CHAR:
                    this.typeData = new TypeD(typeData.INT);
                    return parseInt(exp)
                case typeData.STRING:
                    this.typeData = new TypeD(typeData.INT);
                    return parseInt(exp)
                default:
                    return new Error('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column)
            }
        }

        floatCasts(exp: any){
            let typeExpression = this.expression.typeData.getTypeData()
            switch (typeExpression) {
                case typeData.INT:
                    this.typeData = new TypeD(typeData.FLOAT);
                    return parseFloat(exp)
                case typeData.STRING:
                    this.typeData = new TypeD(typeData.FLOAT);
                    exp = parseFloat(exp + 0.00)
                    
                default:
                    return new Error('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column)
            }
        }

        charCasts(exp: any){
            let typeExpression = this.expression.typeData.getTypeData()
            switch (typeExpression) {
                case typeData.INT:
                    this.typeData = new TypeD(typeData.CHAR);
                    return String.fromCharCode(exp)
                case typeData.FLOAT:
                    this.typeData = new TypeD(typeData.CHAR);
                    return String.fromCharCode(exp)
                default:
                    return new Error('Semantico', `No se puede convertir ${this.expression.typeData.getTypeData()} a ${this.typeData.getTypeData()}`, this.row, this.column)
            }
        }

}