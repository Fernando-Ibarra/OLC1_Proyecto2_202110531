"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolTable = void 0;
class SymbolTable {
    constructor(lastTable) {
        this.lastTable = lastTable;
        this.currentTable = new Map();
        this.name = "";
    }
    // Getters
    getLastTable() {
        return this.lastTable;
    }
    getCurrentTable() {
        return this.currentTable;
    }
    getName() {
        return this.name;
    }
    // Setters
    setLastTable(lastTable) {
        this.lastTable = lastTable;
    }
    setCurrentTable(currentTable) {
        this.currentTable = currentTable;
    }
    setName(name) {
        this.name = name;
    }
    // Métodos
    setVariable(symbol) {
        let found = this.getCurrentTable().get(symbol.getId().toLocaleLowerCase());
        if (found == null) {
            this.currentTable.set(symbol.getId().toLocaleLowerCase(), symbol);
            return true;
        }
        return false;
    }
    getVariable(id) {
        return this.getCurrentTable().get(id.toLocaleLowerCase());
    }
}
exports.SymbolTable = SymbolTable;
