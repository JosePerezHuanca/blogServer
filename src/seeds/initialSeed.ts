import 'dotenv/config';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import bcrypt from 'bcrypt';

async function generateFirstUser(){
    try{
        const existUser=await AppDataSource.getRepository(User).findOne({where: {userName: 'admin'}});
        if(!existUser){
            let firstUser=new User();
            firstUser.userName=process.env.USER_NAME ?? '';
        firstUser.password=await bcrypt.hash(process.env.USER_PASS ??'',10);
            firstUser.isAdmin=true;
            await AppDataSource.getRepository(User).save(firstUser);
            console.log('Se generó el primer registro');
        }
    }
    catch(error){
        console.log('El registro del seed ya existe');
    }
}

export default generateFirstUser;