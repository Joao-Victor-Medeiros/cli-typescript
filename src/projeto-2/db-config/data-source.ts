import 'reflect-metadata';
import "reflect-metadata";
import {Client} from "pg";

export const client = new Client({
    host: "localhost",
    port: 5432,
    user: "admin",
    password: "admin",
    database: "inventario-db"
});



// export const AppDataSource = new DataSource({
//     type: 'postgres',
//     host: 'localhost',
//     port: 5432,
//     username: 'admin',
//     password: 'admin',
//     database: 'project_2',
//     synchronize: true,
//     logging: false,
//     entities: [Categoria, Produto],
//     migrations: [],
//     subscribers: [],
// });

