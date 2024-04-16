"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexControllers = void 0;
const _1 = require("./");
class controller {
    index(req, res) {
        res.status(201).json({ "message": 'System is running...' });
    }
    makeMagic(req, res) {
        let astDot = "";
        try {
            const { code } = req.body;
            let parser = require('./analysis/analyzer');
            let ast = new _1.Tree(parser.parse(code));
            let symbolTable = new _1.SymbolTable();
            symbolTable.setName("Ejemplo 1");
            ast.setGlobalTable(symbolTable);
            ast.setConsole("");
            astDot += "digraph Tree {\n";
            astDot += "node [shape=circle];\n";
            astDot += "node [style=filled];\n";
            astDot += "node [fillcolor=\"#EEEEEE\"];\n";
            astDot += "node [style=filled,color=\"black\"];\n";
            astDot += "node [fontname=\"Arial\"];\n";
            astDot += "node [fontsize=12];\n";
            astDot += "node [fontcolor=\"black\"];\n";
            astDot += "edge [color=\"black\"];\n";
            astDot += "edge [style=\"solid\"];\n";
            astDot += "edge [weight=1];\n";
            astDot += "edge [fontsize=12];\n";
            astDot += "edge [fontname=\"Arial\"];\n";
            astDot += "edge [fontcolor=\"black\"];\n";
            astDot += "edge [dir=\"forward\"];\n";
            astDot += "edge [arrowsize=1];\n";
            astDot += "edge [arrowhead=\"normal\"];\n";
            astDot += "edge [arrowtail=\"dot\"];\n";
            astDot += "node0 [label=\"EXEC\"];\n";
            astDot += "node1 [label=\"INSTRUCTIONS\"];\n";
            astDot += "node0 -> node1;\n";
            for (let i of ast.getInstructions()) {
                console.log(i);
                var result = i.interpret(ast, symbolTable);
                var astGraph = i.ast("node1");
                astDot += astGraph;
                console.log(result);
            }
            astDot += "}";
            console.log(astDot);
            res.status(201).json({
                "codeOutput": ast.getConsole(),
                "ast": astDot
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ "Error": "Error inesperado" });
        }
    }
}
exports.indexControllers = new controller();
