import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { validate } from "class-validator";
import bcrypt from 'bcrypt';
import config from '../config';
import  jwt from 'jsonwebtoken';
import { token } from "morgan";
const UserRepo= AppDataSource.getRepository(User);

class UserController{
    async signup(req:Request,res:Response){
        try{
            const {passwordR, ...userRequest}=req.body;
            let userObj=Object.assign(new User(),userRequest);
            let sal=10;
            let hasResult=await new Promise((resolve,reject)=>{
                bcrypt.hash(userObj.password,sal,(err,result)=>{
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(result);
                    }
                });
            });
            let errors=await validate(userObj);
            if(errors.length>0){
                return res.status(400).json(errors);
            }
            if(userObj.password===passwordR){
                userObj.password=hasResult;
                await UserRepo.save(userObj);
                return res.status(201).json('registrado');
            }
            return res.status(400).json('las contraseñas no coinciden');
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
    
    async signin(req:Request,res:Response){
        try{
            let query= await UserRepo.findOneBy({userName: req.body.userName});
            if(query){
                let match= await bcrypt.compare(req.body.password,query.password);
                if(match){
                    let paiload={id: query.id, isAdmin: query.isAdmin};
                    const token=jwt.sign(paiload, config.secret,{expiresIn: '1h'});
                    return res.status(200).json({message: 'Se inició sesión', token: token, isAdmin: query.isAdmin});
                }
            }
            return res.status(400).json({message: 'error en los datos'});
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
}


export default UserController;