import express from "express"
import cors from "cors"
import { database, environmentConfig } from "./src/config";
import RouterApp from "./src/routes";
import { migrate } from "./src/migrateDB";

// Crea una aplicación Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Inicia el servidor
app.listen(environmentConfig.SERVICE_PORT, async () => {

  const mongoDatabase = await database.initDB();
  const router = new RouterApp({mongoDatabase});

  app.use("/api/v1", router.routes);

  console.log(`Server started correctly and running on port: ${environmentConfig.SERVICE_PORT}`);
  
}); 

//INICIA MIGRACIONES EN CASO DE CORRER EL COMANDO NPM RUN MIGRATE-ARTICLES
migrate();