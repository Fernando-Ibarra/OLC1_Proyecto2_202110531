import { SymbolTable } from './';
import { Instruction } from '../';
import Error from '../exceptions/Errors';
import Method from '../instructions/Method';

export class Tree {
    private instructions: Array<Instruction>;
    private console: string;
    private globalTable: SymbolTable;
    private errors: Array<Error>;
    private funtions: Array<Instruction>;

    constructor(instructions: Array<Instruction>) {
        this.instructions = instructions;
        this.console = "";
        this.globalTable = new SymbolTable();
        this.errors = new Array<Error>;
        this.funtions = new Array<Instruction>;
    }

    // Getters
    public getInstructions(): Array<Instruction> {
        return this.instructions;
    }

    public getConsole(): string {
        return this.console;
    }

    public getGlobalTable(): SymbolTable {
        return this.globalTable;
    }

    public getErrors(): any {
        return this.errors;
    }

    // Setters
    public setInstructions(instructions: Array<Instruction>): void {
        this.instructions = instructions;
    }

    public setConsole(console: string): void {
        this.console = console;
    }

    public setGlobalTable(globalTable: SymbolTable): void {
        this.globalTable = globalTable;
    }

    public setErrors(errors: Array<Error>): void {
        this.errors = errors;
    }
 
    // Methods
    public Cout(content: any) {
        this.console = `${this.console}${content}`
    }


    public getFunctions() {
        return this.funtions;
    }

    public setFunctions(funtions: Array<Instruction>) {
        this.funtions = funtions;
    }

    public addFunction(func: Instruction) {
        this.funtions.push(func);
    }

    public getFunction(id: string) {
        for(let i of this.getFunctions()) {
            if (i instanceof Method ) {
                if ( i.id.toLocaleLowerCase() == id.toLocaleLowerCase()) {
                    return i;
                }
            }
       }
       return null;
    }
}