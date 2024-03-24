"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexControllers = void 0;
const _1 = require("./");
class controller {
    index(req, res) {
        res.json({ "message": 'System is running...' });
    }
    makeMagic(req, res) {
        try {
            const { code } = req.body;
            let parser = require('./analysis/analyzer');
            let ast = new _1.Tree(parser.parse(code));
            let symbolTable = new _1.SymbolTable();
            symbolTable.setName("Ejemplo 1");
            ast.setGlobalTable(symbolTable);
            ast.setConsole("");
            for (let i of ast.getInstructions()) {
                console.log(i);
                var result = i.interpret(ast, symbolTable);
                console.log(result);
            }
            res.send({ "Res": "Success" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "error": error });
        }
    }
}
exports.indexControllers = new controller();
