import { EnvironmentConfig, database, environmentConfig } from "../../config";
import { ConnectionPool } from "mssql";
import { IArticle, IPaginateArticles, IReturnPaginateArticles } from "../../interfaces";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';




class ArticlesService {

    public readonly databaseExternal: Promise<ConnectionPool>
    private readonly environmentConfig: EnvironmentConfig

    constructor() {
        this.databaseExternal = database.getExternalDb()
        this.environmentConfig = environmentConfig
    }

    async getCategories() {

        try {

            const sql = await (await this.databaseExternal).connect();

            const sentence = `
            SELECT DISTINCT 
                LEFT(Merc_Nombre, CHARINDEX(' ', Merc_Nombre + ' ') - 1) AS category
                FROM 
                    ${this.environmentConfig.DB_EXTERNAL_ARTICLES_VIEW}   
                WHERE 
                    Merc_Nombre IS NOT NULL
                ORDER BY category
            `;

            const { recordset }: { recordset: any[] } = await sql.query(sentence);
            return recordset


        } catch (error) {
            this.logError(error)
            throw new Error("Ha ocurrido un error al obtener las categorías.");

        }
    }

    /**
     * 
     * @param {{page: number,limit: number}} 
     * @returns 
     */
    async getArticles(query: IPaginateArticles): Promise<IReturnPaginateArticles> {

        try {
            const offset = (query.page - 1) * query.limit;
            const sql = await (await this.databaseExternal).connect();

            let whereClause = "";

            if (query.category) {
                whereClause += `WHERE LEFT(Merc_Nombre, CHARINDEX(' ', Merc_Nombre + ' ') - 1) = '${query.category}'`;
            }

            if (query.description) {
                whereClause += `${whereClause ? ' AND' : ' WHERE'} CONCAT( Marca, ' ', Modelo, ' ', Merc_Nombre, ' ', Merc_Referencia) LIKE '%${query.description}%'`;
            }

            if (query.brand) {
                whereClause += `${whereClause ? ' AND' : ' WHERE'} Marca = '${query.brand}'`;
            }

            if (query.model) {
                whereClause += `${whereClause ? ' AND' : ' WHERE'} Modelo = '${query.model}'`;
            }

            if (query.year) {
                whereClause += `${whereClause ? ' AND' : ' WHERE'} 
                    Merc_Ano IS NOT NULL AND
                    CHARINDEX('-', Merc_Ano) > 0 AND
                    ${query.year} BETWEEN 
                    CAST(SUBSTRING(Merc_Ano, 1, CHARINDEX('-', Merc_Ano) - 1) AS INT) AND 
                    CAST(SUBSTRING(Merc_Ano, CHARINDEX('-', Merc_Ano) + 1, LEN(Merc_Ano) - CHARINDEX('-', Merc_Ano)) AS INT)`;
            }


            const baseSentence = `
                SELECT
                Merc_Codigo,
                Merc_Referencia,
                Merc_Nombre,
                Marca,
                Modelo,
                Merc_Ano,
                Merc_Existencia_Grl,
                PrecioItbis,
                Precio,
                Precio2,
                PrecioItbis2
                FROM ${this.environmentConfig.DB_EXTERNAL_ARTICLES_VIEW}
                ${whereClause}
                ORDER BY Merc_Nombre
                OFFSET ${offset} ROWS
                FETCH NEXT ${query.limit} ROWS ONLY
            `;

            const sentenceCount = `
                SELECT COUNT(*) AS totalArticles 
                FROM ${this.environmentConfig.DB_EXTERNAL_ARTICLES_VIEW}
                ${whereClause}
            `;

            const { recordset: resultCount }: { recordset: { totalArticles: number }[] } = await sql.query(sentenceCount);
            const { recordset }: { recordset: IArticle[] } = await sql.query(baseSentence);


            

            const totalPages = Math.ceil(resultCount[0].totalArticles / query.limit);

            return {
                totalPages,
                totalArticles: resultCount[0].totalArticles,
                list: recordset
            };

        } catch (error) {
            this.logError(error)
            throw new Error("Ha ocurrido un error al obtener los artículos, intenta nuevamente.");

        }

    }

    async getYears(): Promise<{ year: number }[]> {
        try {

            const sql = await (await this.databaseExternal).connect();

            const sentence = `
            SELECT DISTINCT  TOP 100 year
            FROM (
                SELECT CAST(SUBSTRING(Merc_Ano, 1, CHARINDEX('-', Merc_Ano) - 1) AS INT) AS year
                FROM ${this.environmentConfig.DB_EXTERNAL_ARTICLES_VIEW}
                WHERE CHARINDEX('-', Merc_Ano) > 0

                UNION ALL

                SELECT CAST(SUBSTRING(Merc_Ano, CHARINDEX('-', Merc_Ano) + 1, LEN(Merc_Ano) - CHARINDEX('-', Merc_Ano)) AS INT) AS year
                FROM ${this.environmentConfig.DB_EXTERNAL_ARTICLES_VIEW}
                WHERE CHARINDEX('-', Merc_Ano) > 0
            ) AS CombinedYears
            ORDER BY year DESC
            `

            const { recordset }: { recordset: { year: number }[] } = await sql.query(sentence)

            return recordset

        } catch (error) {
            this.logError(error)
            throw new Error("Ha ocurrido un error al obtener los años, intenta nuevamente.");

        }
    }

    async getBrandsAndModels(query: Partial<IPaginateArticles>): Promise<{ description: number }[]> {
        try {

            const sql = await (await this.databaseExternal).connect();

            let whereClause = `
                    SELECT DISTINCT Marca as description
                    FROM ${this.environmentConfig.DB_EXTERNAL_ARTICLES_VIEW}
                    ORDER BY Marca ASC
                `;

            if (query.brand) {
                whereClause = `
                    SELECT DISTINCT Modelo as description
                    FROM ${this.environmentConfig.DB_EXTERNAL_ARTICLES_VIEW}
                    WHERE Marca = '${query.brand}'
                    ORDER BY Modelo ASC
                `;
            }

            const { recordset }: { recordset: { description: number }[] } = await sql.query(whereClause)

            return recordset

        } catch (error) {
            this.logError(error)
            throw new Error("Ha ocurrido un error al obtener los años, intenta nuevamente.");

        }
    }

    logError(error: any): void {
        const logsFolder = './logs';
        const errorLogFile = path.join(logsFolder, 'error.log');
        const currentDate = new Date().toISOString();
    
        // Crear el directorio de logs si no existe
        if (!fs.existsSync(logsFolder)) {
            fs.mkdirSync(logsFolder);
        }
    
        // Formatear el mensaje de error
        const errorMessage = `${'-'.repeat(50)}\n${currentDate}\n${error.stack}\n`;
    
        // Escribir el mensaje de error en el archivo de logs
        if (fs.existsSync(errorLogFile)) {
            const existingContent = fs.readFileSync(errorLogFile, 'utf8');
            fs.writeFileSync(errorLogFile, errorMessage + existingContent);
        } else {
            fs.writeFileSync(errorLogFile, errorMessage);
        }
    }
    
}

export { ArticlesService } 