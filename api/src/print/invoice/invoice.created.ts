import { IArticleCart, IOrder } from "../../interfaces"
import { utils } from "../../utils"

export const invoiceCreated = ({ order }: { order: IOrder }) => {
    return `
    
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Factura</title>
        <style>
            /* RESET universal */
            * {
            margin: 0;
            padding: 0;
            border: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            color: #000;
            }

            @page {
            margin: 0;
            padding: 0;
            }

            html, body {
            width: 100%;
            height: 100%;
            background: #fff;
            padding: 10px;
            }

            .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            }

            .logo {
            width: 54px;
            height: auto;
            object-fit: cover;
            }

            .info {
            text-align: right;
            }

            .info h1 {
            font-size: 20px;
            margin-bottom: 5px;
            }

            .section-title {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 5px;
            margin-top: 10px;
            }

            .cliente-info, .factura-info {
            margin-bottom: 10px;
            }

            .cliente-info p, .factura-info p {
            margin-bottom: 4px;
            }

            table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
            }

            th {
            background-color: #f2f2f2;
            }

            th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: left;
            font-size: 9px;
            }

            .total {
            text-align: right;
            font-weight: bold;
            padding-top: 10px;
            }

            .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #555;
            }

        </style>
        </head>
        <body>

        <!-- Encabezado -->
        <div class="header">
            <img class="logo" src="https://5slim.do/_next/image?url=%2Fflash-lines.png&w=48&q=75" alt="Logo" />
            <div class="info">
            <h1>FACTURA</h1>
            <p>Número: <strong>#${order._id}</strong></p>
            <p>Fecha de orden: <strong>${utils.formatAmPmLetters(order.createdDate)}</strong></p>
            <p>Estado: <strong>${order.status}</strong></p>
            </div>
        </div>

        <!-- Información del Cliente -->
        <div class="section-title">Información del Cliente</div>
        <div class="cliente-info">
            <p><strong>Nombre: </strong> ${order.client.fullName}</p>
            <p><strong>Dirección: </strong>${utils.fullAddress(order.client.address)}.</p>
            <p><strong>Teléfono: </strong>${order.client.address.phone}</p>
            <p><strong>Email: </strong>${order.client.email}</p>
        </div>

        <!-- Información del Pedido -->
        <div class="section-title" style="margin-top: 20px;">Detalle de Artículos</div>
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            
            ${order.articles.map((article: IArticleCart, index) => {
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${article.description}</td>
                    <td>${article.variant.stock}</td>
                    <td>${utils.dominicanNumberFormat(article.variant.sellingPrice)}</td>
                    <td>${utils.dominicanNumberFormat(article.variant.sellingPrice * article.variant.stock)}</td>
                  </tr>
                `;
              }).join('')}
       
            </tbody>
        </table>

        <!-- Total -->
        <div class="total">
            Total a pagar: <strong>${utils.dominicanNumberFormat(order.total.total)}</strong>
        </div>

        <!-- Footer -->
        <div class="footer">
            Gracias por su compra. 5slim.do - Santo Domingo, República Dominicana.
        </div>

        </body>
        </html>
    
    `
}
