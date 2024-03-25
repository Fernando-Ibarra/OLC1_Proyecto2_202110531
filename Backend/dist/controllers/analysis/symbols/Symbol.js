"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbol = void 0;
class Symbol {
    constructor(type, id, value) {
        this.type = type;
        this.id = id.toLocaleLowerCase();
        this.value = value;
    }
    // Getters
    getType() {
        return this.type;
    }
    getId() {
        return this.id;
    }
    getValue() {
        return this.value;
    }
    // Setters
    setType(type) {
        this.type = type;
    }
    setId(id) {
        this.id = id;
    }
    setValue(value) {
        this.value = value;
    }
}
exports.Symbol = Symbol;
