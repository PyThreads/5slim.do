import { IArticleCart, IOrder } from "../../interfaces"
import { utils } from "../../utils"
import QRCode from "qrcode";

export const invoiceLabel = async ({ order }: { order: IOrder }) => {

    const result = await QRCode.toDataURL(`https://waze.com/ul?ll=${order.client.address?.map?.lat || ''},${order.client.address?.map?.lng || ''}&navigate=yes`, { errorCorrectionLevel: 'H' })


    return `
    <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Label Template</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @page {
            size: 4in 3in;
            margin: 0;
        }

        @media print {
            body {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }

        body {
            font-family: 'Arial', sans-serif;
            width: 4in;
            height: 3in;
            background: white;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .label-container {
            width: 100%;
            height: 100%;
            border: 2px solid #333;
            display: grid;
            grid-template-rows: auto 1fr auto;
            padding: 8px;
            gap: 6px;
        }

        .header-section {
            display: flex;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 6px;
        }

        .center-logo {
            width: 55px;
            height: 55px;
            border-radius: 4px;
            overflow: hidden;
        }

        .center-logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }


        .main-content {
            display: grid;
            grid-template-columns: 1fr 70px;
            gap: 10px;
            align-items: start;
        }

        .customer-info {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .info-row {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            line-height: 1.2;
        }

        .info-label {
            font-weight: bold;
            color: #34495e;
            min-width: 45px;
            font-size: 9px;
        }

        .info-value {
            color: #2c3e50;
            flex: 1;
            word-break: break-word;
        }

        .location-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
        }

        .location-qr {
            width: 65px;
            height: 65px;
            background: #f0f0f0;
            border: 2px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 7px;
            color: #666;
            text-align: center;
            border-radius: 4px;
        }

        .location-text {
            font-size: 8px;
            color: #2c3e50;
            text-align: center;
            font-weight: bold;
            max-width: 65px;
            word-wrap: break-word;
        }

        .comments-text {
            font-size: 10px;
            color: #666;
            font-weight: bold;
            text-align: center;
            line-height: 1.3;
            word-wrap: break-word;
            overflow-wrap: break-word;
            hyphens: auto;
        }

        .comments-box {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 20px;
            padding: 4px 8px;
            margin-top: 4px;
        }

        .footer-section {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 8px;
            border-top: 1px solid #ddd;
            padding-top: 4px;
        }

        .footer-item {
            text-align: center;
        }

        .footer-label {
            font-size: 8px;
            color: #7f8c8d;
            font-weight: bold;
            margin-bottom: 1px;
        }

        .footer-value {
            font-size: 11px;
            color: #2c3e50;
            font-weight: bold;
        }

        .icon {
            width: 12px;
            height: 12px;
            display: inline-block;
            margin-right: 2px;
            vertical-align: middle;
        }

        .icon-user { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>') no-repeat center; background-size: contain; }
        
        .icon-email { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>') no-repeat center; background-size: contain; }
        
        .icon-phone { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>') no-repeat center; background-size: contain; }
        
        .icon-location { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>') no-repeat center; background-size: contain; }
        
        .icon-payment { background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23333"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>') no-repeat center; background-size: contain; }
    </style>
</head>
<body>
    <div class="label-container">
        <!-- Header Section -->
        <div class="header-section">
            <div class="center-logo">
                <img src="https://5slim.do/_next/image?url=%2Fflash-lines.png&w=48&q=75" alt="Logo de la empresa">
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="customer-info">
                <div class="info-row">
                    <span class="icon icon-user"></span>
                    <span class="info-label">Nombre:</span>
                    <span class="info-value">${order.client.fullName}</span>
                </div>
                <div class="info-row">
                    <span class="icon icon-email"></span>
                    <span class="info-label">Email:</span>
                    <span class="info-value">${order.client.email}</span>
                </div>
                <div class="info-row">
                    <span class="icon icon-phone"></span>
                    <span class="info-label">Tel:</span>
                    <span class="info-value">${order.client.address?.phone || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="icon icon-location"></span>
                    <span class="info-label">Dirección:</span>
                    <span class="info-value">${utils.fullAddress(order.client.address)}</span>
                </div>
                <div class="info-row">
                    <span class="icon icon-payment"></span>
                    <span class="info-label">Pago:</span>
                    <span class="info-value">${order.paymentType}</span>
                </div>
            </div>
            
            <div class="location-section">
                <div class="location-qr-container">
                    <img src="${result}" width="65" height="65" alt="Logo de la empresa">
                </div>
  
            </div>
        </div>

        <div class="comments-box">
            <div class="comments-text">${order.comment || 'Sin comentarios'}</div>
        </div>

        <!-- Footer Section -->
        <div class="footer-section">
            <div class="footer-item">
                <div class="footer-label">FECHA ORDEN</div>
                <div class="footer-value">${utils.formatLetters(order.createdDate)}</div>
            </div>
            <div class="footer-item">
                <div class="footer-label">N° ORDEN</div>
                <div class="footer-value">#${order._id}</div>
            </div>
            <div class="footer-item">
                <div class="footer-label">ARTÍCULOS</div>
                <div class="footer-value">${order.articles.length} items</div>
            </div>
        </div>
    </div>
</body>
</html>
    
    `
}
