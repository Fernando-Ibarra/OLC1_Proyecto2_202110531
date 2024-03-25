import TypeD from '../symbols/TypeD';

export class Symbol {
    private type: TypeD;
    private id: string;
    private value: any;

    constructor(type: TypeD, id: string, value: any) {
        this.type = type;
        this.id = id.toLocaleLowerCase();
        this.value = value;
    }

    // Getters
    public getType(): TypeD {
        return this.type;
    }

    public getId(): string {
        return this.id;
    }

    public getValue(): any {
        return this.value;
    }

    // Setters
    public setType(type: TypeD): void {
        this.type = type;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setValue(value: any): void {
        this.value = value;
    }
    
}