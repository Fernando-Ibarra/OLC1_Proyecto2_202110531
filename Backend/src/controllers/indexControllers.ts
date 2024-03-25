import { Request, Response } from 'express';
import { Tree, SymbolTable } from './'

class controller {
    public index(req: Request, res: Response) {
        res.status(201).json({ "message": 'System is running...'});
    }

    public makeMagic(req: Request, res: Response) {
        try {
            const { code } = req.body;
            let parser = require('./analysis/analyzer');
            let ast = new Tree(parser.parse(code));
            let symbolTable = new SymbolTable();
            symbolTable.setName("Ejemplo 1");
            ast.setGlobalTable(symbolTable);
            ast.setConsole("");
            for(let i of ast.getInstructions()){
                console.log(i);
                var result = i.interpret(ast, symbolTable);
                console.log(result);
            }
            res.status(201).json({"codeOutput": ast.getConsole() })
        } catch (error) {
            console.log(error);
            res.status(500).json({"Error": "Error inesperado"})
        }
    }
}

export const indexControllers = new controller();