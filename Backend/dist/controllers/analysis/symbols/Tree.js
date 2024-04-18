"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const _1 = require("./");
const Method_1 = __importDefault(require("../instructions/Method"));
class Tree {
    constructor(instructions) {
        this.instructions = instructions;
        this.console = "";
        this.globalTable = new _1.SymbolTable();
        this.errors = new Array;
        this.funtions = new Array;
    }
    // Getters
    getInstructions() {
        return this.instructions;
    }
    getConsole() {
        return this.console;
    }
    getGlobalTable() {
        return this.globalTable;
    }
    getErrors() {
        return this.errors;
    }
    // Setters
    setInstructions(instructions) {
        this.instructions = instructions;
    }
    setConsole(console) {
        this.console = console;
    }
    setGlobalTable(globalTable) {
        this.globalTable = globalTable;
    }
    setErrors(errors) {
        this.errors = errors;
    }
    // Methods
    Cout(content) {
        this.console = `${this.console}${content}`;
    }
    getFunctions() {
        return this.funtions;
    }
    setFunctions(funtions) {
        this.funtions = funtions;
    }
    addFunction(func) {
        this.funtions.push(func);
    }
    getFunction(id) {
        for (let i of this.getFunctions()) {
            if (i instanceof Method_1.default) {
                if (i.id.toLocaleLowerCase() == id.toLocaleLowerCase()) {
                    return i;
                }
            }
        }
        return null;
    }
}
exports.Tree = Tree;
