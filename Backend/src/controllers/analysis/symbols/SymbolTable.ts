import { typeData, Symbol } from './';
import TypeD from '../symbols/TypeD';

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
        let found: Symbol = <Symbol>this.getCurrentTable().get(symbol.getId().toLocaleLowerCase());
        if (found == null) {
            this.currentTable.set(symbol.getId().toLocaleLowerCase(), symbol);
            return true;
        }
        return false
    }

    public getVariable(id: string) {
        for (let i: SymbolTable = this; i != null; i = i.getLastTable()) {
            console.log(`i GET VARIABLES ${ id }`, i)
            let founded: Symbol = <Symbol>i.getCurrentTable().get(id.toLocaleLowerCase());
            console.log(`founded GET VARIABLES ${ id }`, founded)
            if (founded != null) return founded;
        }
        return null;
    }
    
}