export default class Error {
    private typeError: string;
    private description: string;
    private row: number;
    private column: number;

    constructor(typeError: string, description: string, column: number, row: number) {
        this.typeError = typeError;
        this.description = description;
        this.row = row;
        this.column = column;
    }

    // Getters
    public getTypeError(): string {
        return this.typeError;
    }

    public getDescription(): string {
        return this.description;
    }

    public getRow(): number {
        return this.row;
    }

    public getColumn(): number {
        return this.column;
    }

    // Setters
    public setTypeError(typeError: string): void {
        this.typeError = typeError;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setRow(row: number): void {
        this.row = row;
    }

    public setColumn(column: number): void {
        this.column = column;
    }
}