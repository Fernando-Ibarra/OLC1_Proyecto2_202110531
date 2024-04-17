import { SymbolTable } from './';
import { Instruction } from '../';
import Error from '../exceptions/Errors';

export class Tree {
    private instructions: Array<Instruction>;
    private console: string;
    private globalTable: SymbolTable;
    private errors: Array<Error>;

    constructor(instructions: Array<Instruction>) {
        this.instructions = instructions;
        this.console = "";
        this.globalTable = new SymbolTable();
        this.errors = new Array<Error>;
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
}