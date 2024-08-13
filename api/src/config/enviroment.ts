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

    constructor() {

        this.SERVICE_PORT = Number(process.env.SERVICE_PORT || 8000);

        this.DB_NAME = process.env.DB_NAME || '5SLIM-DO';
        this.DB_USER = process.env.DB_USER || 'root';
        this.DB_PASSWORD = process.env.DB_PASSWORD || 'root';
        this.DB_HOST = process.env.DB_HOST || 'localhost';
        this.DB_PORT = Number(process.env.DB_PORT) || 27017;

        this.SMTP_USER = process.env.SMTP_USER || "tienda-no-reply";
        this.SMTP_SEND_AS = process.env.SMTP_SEND_AS || "tienda-no-reply@lbcautoparts.net";
        this.SMTP_PASSWORD = process.env.SMTP_PASSWORD || "ynP333ZHe8JJPYFK";
        this.SMTP_SERVER = process.env.SMTP_SERVER || "mail.smtp2go.com";
        this.SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    }
}

export { EnvironmentConfig };
