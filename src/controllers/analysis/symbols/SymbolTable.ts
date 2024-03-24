import { TypeD, typeData, Symbol } from './';

export class SymbolTable {

    private lastTable: SymbolTable | any;
    private currentTable: Map<string, Symbol>;
    private name: string;

    constructor(lastTable?: SymbolTable | any) {
        this.lastTable = lastTable;
        this.currentTable = new Map<string, Symbol>();
        this.name = "";
    }

    // Getters
    public getLastTable(): SymbolTable {
        return this.lastTable;
    }

    public getCurrentTable(): Map<string, Symbol> {
        return this.currentTable;
    }

    public getName(): string {
        return this.name;
    }

    // Setters
    public setLastTable(lastTable: SymbolTable): void {
        this.lastTable = lastTable;
    }

    public setCurrentTable(currentTable: Map<string, Symbol>): void {
        this.currentTable = currentTable;
    }

    public setName(name: string): void {
        this.name = name;
    }

    // Métodos
    public setVariable(symbol: Symbol) {
    }
}