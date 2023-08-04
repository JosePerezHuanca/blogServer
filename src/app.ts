import express from 'express';
import { AppDataSource} from './data-source';
import morgan from 'morgan';
import indexRouter from './routes/indexRoute';
import postRouter from './routes/postRoute'
import config from './config';
import cors from 'cors';
import generateFirstUser from './seeds/initialSeed';

const app=express();

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/', indexRouter);
app.use('/posts',postRouter);

AppDataSource.initialize()
.then(()=>{
    console.log(`Base de datos en el puerto ${config.dbPort}`)
    generateFirstUser();
    const port=config.port;
    app.listen(port, ()=>{
        console.log(`servidor en el puerto ${port}`);
    });
})
.catch(error=>{
    console.log(error.message);
});
