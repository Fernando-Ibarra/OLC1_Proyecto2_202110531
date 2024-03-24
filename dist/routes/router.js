"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
class router {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', controllers_1.indexControllers.index);
        this.router.post('/makeMagic', controllers_1.indexControllers.makeMagic);
    }
}
const indexRouter = new router();
exports.default = indexRouter.router;
