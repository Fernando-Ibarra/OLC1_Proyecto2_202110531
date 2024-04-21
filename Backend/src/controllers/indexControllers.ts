import { Request, Response } from 'express';
import { Tree, SymbolTable } from './'
import Method from './analysis/instructions/Method';
import Declaration from './analysis/instructions/Declaration';
import Execute from './analysis/instructions/Execute';
import Functions from './analysis/instructions/Functions';

class controller {

    public index(req: Request, res: Response) {
        res.status(201).json({ "message": 'System is running...'});
    }

    public makeMagic(req: Request, res: Response) {
        let astDot: string = "";
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
        astDot += "node0 [label=\"ROOT\"];\n";
        astDot += "node1 [label=\"INSTRUCTIONS\"];\n";
        astDot += "node0 -> node1;\n";

        const { code } = req.body;
            let parser = require('./analysis/analyzer');
            let ast = new Tree(parser.parse(code));
            let symbolTable = new SymbolTable();
            symbolTable.setName("Proyecto 2");
            ast.setGlobalTable(symbolTable);
            ast.setConsole("");
            let execute = null;

            for(let i of ast.getInstructions()){

                if (i instanceof Method ) {
                    i.id = i.id.toLocaleLowerCase();
                    ast.addFunction(i);
                }

                if (i instanceof Functions ) {
                    i.id = i.id.toLocaleLowerCase();
                    ast.addFunction(i);
                }

                if( i instanceof Declaration ) {
                    let result = i.interpret(ast, symbolTable);
                    if (result instanceof Error) {
                        console.log(result);
                    }
                }

                if (i instanceof Execute ) {
                    execute = i;
                }

                console.log(i);
                var astGraph = i.ast("node1");
                astDot += astGraph;
            }

            if (execute != null) {
                let result = execute.interpret(ast, symbolTable);
                if (result instanceof Error) {
                    console.log(result);
                }
            }


            astDot += "}";

            
            console.log("---------TABLA--------")
            console.log(symbolTable);
            console.log("---------CONSOLE--------")
            console.log(ast.getConsole());

            res.status(201).json({
                "codeOutput": ast.getConsole(),
                "ast": astDot
            })

        // try {
            
        // } catch (error) {
        //     console.log(error);
        //     res.status(500).json({"Error": "Error inesperado"})
        // }
    }
}

export const indexControllers = new controller();