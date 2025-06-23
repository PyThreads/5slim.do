import dotenv from 'dotenv';
dotenv.config();

class EnvironmentConfig {
    public readonly SERVICE_PORT: number;

    public readonly DB_NAME: string;
    public readonly DB_USER: string;
    public readonly DB_PASSWORD: string;
    public readonly DB_HOST: string;
    public readonly DB_PORT: number;

    public readonly SMTP_USER: string;
    public readonly SMTP_SEND_AS: string;
    public readonly SMTP_PASSWORD: string;
    public readonly SMTP_SERVER: string;
    public readonly SMTP_PORT: Number;

    public readonly microsoftClientId: string;
    public readonly microsoftAuthority: string;
    public readonly microsfotClientSecret: string;
    public readonly microsoftSendEmail: string;
    public readonly CLOUDFLARE_ACCOUNT_ID : string;
    public readonly CLOUDFLARE_IMAGES_TOKEN : string;

    public readonly timeZone: string

    constructor() {

        this.SERVICE_PORT = Number(process.env.SERVICE_PORT || 8000);

        this.timeZone = "America/Santo_Domingo";

        this.microsoftClientId = "b097903b-5a03-4ef7-ab43-8ff7efa5c0c1", // ID de la aplicación registrada
        this.microsoftAuthority = "https://login.microsoftonline.com/d891dee3-8f04-4313-b79d-450fce8bba75", // Tenant ID
        this.microsfotClientSecret = "-pi8Q~uaoNBfH7PwoalCk~6ckGcohjCJ4xvxjaJ_" // Reemplaza por el secret de la aplicación
        this.microsoftSendEmail = "no-reply@5slim.do"

        
        this.DB_NAME = process.env.DB_NAME || 'FIVESLIM-DB';
        this.DB_USER = process.env.DB_USER || 'root';
        this.DB_PASSWORD = process.env.DB_PASSWORD || 'root';
        this.DB_HOST = process.env.DB_HOST || 'localhost';
        this.DB_PORT = Number(process.env.DB_PORT) || 27019;

        this.SMTP_USER = process.env.SMTP_USER || ""; 
        this.SMTP_SEND_AS = process.env.SMTP_SEND_AS || "";
        this.SMTP_PASSWORD = process.env.SMTP_PASSWORD || "ynP333ZHe8JJPYFK";
        this.SMTP_SERVER = process.env.SMTP_SERVER || "mail.smtp2go.com";
        this.SMTP_PORT = Number(process.env.SMTP_PORT) || 465;

        this.CLOUDFLARE_ACCOUNT_ID = '8e63ba5b543a5e7b99fe1fc8cb2543fb';
        this.CLOUDFLARE_IMAGES_TOKEN = '-9CsPFlsjbWYa5o1Q7flsQvdrs3NHkx1bq0c9w6P';
    }
}

export { EnvironmentConfig };
