import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Post } from "./entity/Post"
import config from './config';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: config.dbHost,
    port:config.dbPort,
    username: config.dbUser,
    password: config.dbPass,
    database: config.DB,
    synchronize: true,
    logging: false,
    entities: [User,Post],
})
