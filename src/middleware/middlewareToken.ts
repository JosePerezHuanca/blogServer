import { Request, Response, NextFunction} from "express";
import config from '../config';
import jwt  from "jsonwebtoken";

const verifyToken=(req:Request,res:Response, next:NextFunction)=>{
    try{
        let authHeader=req.headers['authorization'];
        let tokenRequest=authHeader && authHeader.split(' ')[1];
        if(tokenRequest==null){
            return res.status(403).json({message: 'acceso restringido'});
        }
        jwt.verify(tokenRequest, config.secret,(err, user)=>{
            if(err){
                return res.status(401).json({message:'proporcione un token válido'});
            }
            req.user=user;
            next();
        })
    }
    catch(error){
        return res.status(500).json(error);
    }
}

export default verifyToken;