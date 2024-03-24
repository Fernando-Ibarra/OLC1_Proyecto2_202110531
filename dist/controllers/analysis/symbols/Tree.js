"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const _1 = require("./");
class Tree {
    constructor(instructions) {
        this.instructions = instructions;
        this.console = "";
        this.globalTable = new _1.SymbolTable();
        this.errors = new Array;
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
}
exports.Tree = Tree;
