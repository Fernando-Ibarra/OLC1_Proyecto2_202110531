import { Router } from 'express';
import { indexControllers } from '../controllers'

class router {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', indexControllers.index);
        this.router.post('/makeMagic', indexControllers.makeMagic);
    }
}

const indexRouter = new router();
export default indexRouter.router;