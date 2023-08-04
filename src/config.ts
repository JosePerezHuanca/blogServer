import 'dotenv/config';

const secretToken=process.env.SECRET_TOKEN;
if(!secretToken){
    throw new Error('La clabe secreta no está configurada')
}

export default {
    port: Number(process.env.PORT),
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPass: process.env.DB_PASS,
    DB: process.env.DB,
    dbPort: Number(process.env.DB_PORT),
    secret: secretToken
};


