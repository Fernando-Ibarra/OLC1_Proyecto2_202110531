"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Error {
    constructor(typeError, description, row, column) {
        this.typeError = typeError;
        this.description = description;
        this.row = row;
        this.column = column;
    }
    // Getters
    getTypeError() {
        return this.typeError;
    }
    getDescription() {
        return this.description;
    }
    getRow() {
        return this.row;
    }
    getColumn() {
        return this.column;
    }
    // Setters
    setTypeError(typeError) {
        this.typeError = typeError;
    }
    setDescription(description) {
        this.description = description;
    }
    setRow(row) {
        this.row = row;
    }
    setColumn(column) {
        this.column = column;
    }
}
exports.default = Error;
