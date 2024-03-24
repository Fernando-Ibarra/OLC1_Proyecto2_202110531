import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/router';
import bodyParser from 'body-parser';

class server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): any {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: false }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    routes(): void {
        this.app.use("/", router);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const app = new server();
app.start();