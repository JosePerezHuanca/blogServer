import { Request, Response} from "express";
import { Post } from "../entity/Post";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { User } from "../entity/User";
import { Between } from "typeorm";
import slugify from "slugify";
const postRepo=AppDataSource.getRepository(Post);

class PostController{
    async getPosts(req:Request,res:Response){
        try{
            if(req.query){
                let page: number= parseInt(req.query.page as string);
                let results: number= parseInt(req.query.results as string);
                if(isNaN(page) || page===undefined){
                    page=1;
                }
                if(isNaN(results)||results===undefined){
                    results=10;
                }
                let query= await postRepo.find({take: results,skip: (page -1) * results,relations:['user']});
                let modifiedQuery=query.map(post=>{
                    let {user, ...rest}=post;
                    let modifiedUser={id: user.id, userName: user.userName, isAdmin: user.isAdmin};
                    return {...rest, user: modifiedUser};
                });
                return res.status(200).json(modifiedQuery);
            }
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
    
    async getPost(req:Request,res:Response){
        try{
            let slugParam =req.params.slug;
            let dateParam = req.params.date;
            let date=new Date(dateParam); 
            let startDate = new Date(date);
            startDate.setUTCHours(0, 0, 0, 0); // Establecer hora al inicio del día (00:00:00)
            let endDate = new Date(date);
            endDate.setUTCHours(23, 59, 59, 999); // Establecer hora al final del día (23:59:59.999)
            let query=await postRepo.findOne({where: {creationDate: Between(startDate, endDate), urlSlug: slugParam}, relations:['user']});
            if (query) {
                let { user, ...rest } = query;
                let modifiedUser = { id: user.id, userName: user.userName, isAdmin: user.isAdmin };
                let modifiedQuery = { ...rest, user: modifiedUser };
                return res.status(200).json(modifiedQuery);
            }
            return res.status(404).json({message: 'not found'});
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
    
    async newPost(req:Request,res:Response){
        try{
            let idToken=req.user.id;
            let isAdminToken=req.user.isAdmin;
            let postObj=Object.assign(new Post(), req.body);
            let slug= slugify(req.body.title);
            postObj.urlSlug=slug;
            let currentDate=new Date();
            postObj.creationDate=currentDate;
            postObj.user=idToken;
            let errors=await validate(postObj);
            if(errors.length>0){
                return res.status(400).json(errors);
            }
            if(isAdminToken===true){
                await postRepo.save(postObj);
                return res.status(201).json({message: 'se creó el post'});
            }
            return res.status(403).json({message: 'debes ser admin para realizar esta acción'});
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
    
    async updatePost(req:Request,res:Response){
        try{
            let id:number=parseInt(req.params.id);
            let idToken=req.user.id;
            let isAdminToken=req.user.isAdmin;
            let query=await postRepo.findOneBy({id: id});
            if(!query){
                return res.status(404).json({message: 'no se puede actualizar porque no existe'});
            }
            if(query.user!==idToken){
                return res.status(403).json({message: 'no estás autorizado para realizar esta acción'});
            }
            let postObj=Object.assign(new Post(),req.body);
            let errors=await validate(postObj);
            if(errors.length>0){
                return res.status(400).json(errors);
            }
            if(isAdminToken===true){
                await postRepo.update(id,postObj);
                return res.status(200).json({message: 'post actualizado'});
            }
            return res.status(403).json({message: 'deves ser admin para realizar esta acción'})
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
    
    async deletePost(req:Request, res:Response){
        try{
            let id:number=parseInt(req.params.id);
            let idToken=req.user.id;
            let isAdminToken=req.user.isAdmin;
            let query=await postRepo.findOneBy({id: id});
            if(!query){
                return res.status(404).json({message: 'no se puede borrar porque no existe'});
            }
            if(query.user!== idToken){
                return res.status(403).json({message: 'no estás autirizado para realizar esta acción'});
            }
            if(isAdminToken===true){
                await postRepo.delete(id)
                return res.status(200).json({message: 'se eliminó el post'});
            }
            return res.status(403).json({message: 'Deves ser admin para realizar esta acción'})
        }
        catch(error){
            return res.status(500).json(error);
        }
    }
}


export default PostController;