import {client} from './db-config/data-source';

client.connect()
    .then(() => console.log("Conectado!"))
    .catch(err => console.error("Erro ao conectar:", err))
    .finally(() => client.end());