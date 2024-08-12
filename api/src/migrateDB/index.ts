import { database, environmentConfig } from "../config";
import fs from "fs"
import path from "path"

interface IArticle {
    Merc_Codigo: number;
    Merc_Referencia: string;
    Merc_Codigo_Barra: string;
    Merc_Nombre: string;
    Merc_Ubicacion_01: string;
    Merc_Ubicacion_02: string;
    Merc_Ubicacion_03: string;
    Alias: string;
    Marca: string;
    Modelo: string;
    Merc_Ano: string;
    Merc_Existencia_Grl: number;
    Merc_Existencia_A01: number;
    Merc_Existencia_A02: number;
    Merc_Existencia_A03: number;
    Precio: number;
    PrecioItbis: number;
    Precio2: number;
    PrecioItbis2: number;
}




const migrate = async () => {

    const terminalParams = process.argv;

    if (terminalParams.length > 2 && terminalParams[3] === "migrate") {

        try {

            console.log("Initializing migration...");

            const databaseExternal = database.getExternalDb();
            const sql = await (await databaseExternal).connect();

            const filePath = path.resolve(__dirname, 'success.json');
            const data = await fs.promises.readFile(filePath, 'utf8');
            const articles = JSON.parse(data);

            try {
                await sql.query(`DROP database [${environmentConfig.DB_EXTERNAL_NAME}]`);
            } catch (error) {
            }

            try {
                await sql.query(`create database [${environmentConfig.DB_EXTERNAL_NAME}]`);
            } catch (error) {
            }

            try {
                await sql.query(`DROP TABLE ARTICLES`);
            } catch (error) {
            }

            try {
                await sql.query(`DROP VIEW ArticlesView`);
            } catch (error) {
            }

            await sql.query(`
            CREATE TABLE ARTICLES (
                Merc_Codigo INT NULL,
                Merc_Referencia VARCHAR(50) NULL,
                Merc_Codigo_Barra VARCHAR(20) NULL,
                Merc_Nombre VARCHAR(100) NULL,
                Merc_Ubicacion_01 VARCHAR(20) NULL,
                Merc_Ubicacion_02 VARCHAR(20) NULL,
                Merc_Ubicacion_03 VARCHAR(20) NULL,
                Alias VARCHAR(50) NULL,
                Marca VARCHAR(50) NULL,
                Modelo VARCHAR(50) NULL,
                Merc_Ano VARCHAR(20) NULL,
                Merc_Existencia_Grl INT NULL,
                Merc_Existencia_A01 INT NULL,
                Merc_Existencia_A02 INT NULL,
                Merc_Existencia_A03 INT NULL,
                Precio DECIMAL(18, 2) NULL,
                PrecioItbis DECIMAL(18, 2) NULL,
                Precio2 DECIMAL(18, 2) NULL,
                PrecioItbis2 DECIMAL(18, 2) NULL
            );
        `);

            // Crear la vista ArticlesView
            await sql.query(`
            CREATE VIEW ArticlesView AS
            SELECT
                Merc_Codigo,
                Merc_Referencia,
                Merc_Codigo_Barra,
                Merc_Nombre,
                Merc_Ubicacion_01,
                Merc_Ubicacion_02,
                Merc_Ubicacion_03,
                Alias,
                Marca,
                Modelo,
                Merc_Ano,
                Merc_Existencia_Grl,
                Merc_Existencia_A01,
                Merc_Existencia_A02,
                Merc_Existencia_A03,
                Precio,
                PrecioItbis,
                Precio2,
                PrecioItbis2
            FROM ARTICLES;
        `);

            for (const nm of articles) {

                const article: IArticle = nm;

                // Preparar la consulta de inserción para cada artículo
                try {

                    const insertQuery = `
                INSERT INTO ARTICLES (
                    Merc_Codigo,
                    Merc_Referencia,
                    Merc_Codigo_Barra,
                    Merc_Nombre,
                    Merc_Ubicacion_01,
                    Merc_Ubicacion_02,
                    Merc_Ubicacion_03,
                    Alias,
                    Marca,
                    Modelo,
                    Merc_Ano,
                    Merc_Existencia_Grl,
                    Merc_Existencia_A01,
                    Merc_Existencia_A02,
                    Merc_Existencia_A03,
                    Precio,
                    PrecioItbis,
                    Precio2,
                    PrecioItbis2
                ) VALUES (
                    ${article.Merc_Codigo},
                    '${article.Merc_Referencia}',
                    '${article.Merc_Codigo_Barra}',
                    '${article.Merc_Nombre}',
                    '${article.Merc_Ubicacion_01}',
                    '${article.Merc_Ubicacion_02}',
                    '${article.Merc_Ubicacion_03}',
                    '${article.Alias}',
                    '${article.Marca}',
                    '${article.Modelo}',
                    '${article.Merc_Ano}',
                    ${article.Merc_Existencia_Grl},
                    ${article.Merc_Existencia_A01},
                    ${article.Merc_Existencia_A02},
                    ${article.Merc_Existencia_A03},
                    ${article.Precio},
                    ${article.PrecioItbis},
                    ${article.Precio - (article.Precio * 0.15)},
                    ${(article.Precio - (article.Precio * 0.15))  + ((article.Precio * 0.15) * 0.18) }
                );
            `;

                    // Ejecutar la consulta de inserción y agregar la promesa al array
                    await sql.query(insertQuery);
                    continue

                } catch (error) {
                    console.log(error)
                }
            };

            console.log("Finished migration...");

        } catch (error) {
            console.log("Migration finished with error: " + error)
        }
    }
}

export { migrate }