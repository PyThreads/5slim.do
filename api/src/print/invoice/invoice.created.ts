import { IArticleCart, IOrder, IOrderDiscountType } from "../../interfaces"
import { utils } from "../../utils"
import QRCode from "qrcode";

export const invoiceCreated = async ({ order, logo, businessName }: { order: IOrder, logo: string, businessName?: string }) => {
    const qrResult = order.client.address?.map?.url ? await QRCode.toDataURL(order.client.address.map.url, { errorCorrectionLevel: 'H' }) : null;
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
            <div style="display: flex; flex-direction: column; align-items: flex-start;">
                <img class="logo" src="${logo}" alt="Logo" />
                ${businessName ? `<p style="font-size: 14px; font-weight: bold; margin-top: 5px; color: #333;">${businessName}</p>` : ''}
            </div>
            <div class="info">
            <h1>FACTURA</h1>
            <p>Número: <strong>#${order._id}</strong></p>
            <p>Fecha de orden: <strong>${utils.formatAmPmLetters(order.createdDate)}</strong></p>
            <p>Estado: <strong>${order.status}</strong></p>
            </div>
        </div>

        <!-- Información del Cliente -->
        <div class="section-title">Información del Cliente</div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="cliente-info" style="flex: 1;">
                <p><strong>Nombre: </strong> ${order.client.fullName}</p>
                <p><strong>Dirección: </strong>${order.client.address ? utils.fullAddress(order.client.address) : 'N/A'}.</p>
                <p><strong>Teléfono: </strong>${order.client.address?.phone || order.client.phone || 'N/A'}</p>
                <p><strong>Email: </strong>${order.client.email}</p>
            </div>
            ${order.client.address?.map?.url ? `
                <div style="text-align: center;">
                    <p style="font-size: 10px; margin-bottom: 5px;">Waze</p>
                    <img src="${qrResult}" alt="QR Waze" style="width: 80px; height: 80px;"/>
                </div>
            ` : ''}
        </div>

        <!-- Información del Pedido -->
        <div class="section-title" style="margin-top: 20px;">Detalle de Artículos</div>
        <table>
            <thead>
            <tr>
                <th>#</th>
                <th>Imagen</th>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Descuento</th>
                <th>Total</th>
            </tr>
            </thead>
            <tbody>
            
            ${order.articles.map((article: IArticleCart, index) => {
                const imageUrl = article.variant.images?.find(img => img.primary)?.url || 
                               article.variant.images?.[0]?.url || 
                               article.images?.find(img => img.primary)?.url || 
                               article.images?.[0]?.url || 
                               '/Image.svg';
                const itemSubTotal = article.variant.sellingPrice * article.variant.stock;
                const itemDiscount = article.orderDiscount 
                    ? (article.orderDiscount.type === IOrderDiscountType.PERCENT 
                        ? (itemSubTotal * article.orderDiscount.value / 100)
                        : article.orderDiscount.value)
                    : 0;
                const itemTotal = itemSubTotal - itemDiscount;
                const articleCode = article.externalCode ? `${article._id}-${article.externalCode}` : `${article._id}`;
                const articleName = `${articleCode} ${article.description}`;
                return `
                  <tr>
                    <td>${index + 1}</td>
                    <td style="text-align: center;"><img src="${imageUrl}" alt="${article.description}" style="width: 30px; height: 30px; object-fit: cover; border-radius: 4px;"/></td>
                    <td>${articleName}</td>
                    <td>${article.variant.stock}</td>
                    <td>${utils.dominicanNumberFormat(article.variant.sellingPrice)}</td>
                    <td>${itemDiscount > 0 ? utils.dominicanNumberFormat(itemDiscount) : '-'}</td>
                    <td>${utils.dominicanNumberFormat(itemTotal)}</td>
                  </tr>
                `;
              }).join('')}
       
            </tbody>
        </table>

        <!-- Total y Pagos -->
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
            <div style="width: 48%;">
                ${order.payments && order.payments.length > 0 ? `
                    <div class="section-title">Historial de Pagos</div>
                    <table style="margin-top: 5px;">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Método</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.payments.map(payment => `
                                <tr>
                                    <td>${utils.formatAmPmLetters(payment.paymentDate)}</td>
                                    <td>${payment.method}</td>
                                    <td>${utils.dominicanNumberFormat(payment.amount)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                ` : ''}
            </div>
            <div style="width: 48%; text-align: right;">
                <div class="total">
                    <p>Subtotal: <strong>${utils.dominicanNumberFormat(order.total.subTotal)}</strong></p>
                    <p>Descuento: <strong>${utils.dominicanNumberFormat(order.total.discount)}</strong></p>
                    <p style="font-size: 14px; margin-top: 10px;">Total: <strong>${utils.dominicanNumberFormat(order.total.total)}</strong></p>
                    ${order.payments && order.payments.length > 0 ? `
                        <p style="color: #28a745; margin-top: 5px;">Total Pagado: <strong>${utils.dominicanNumberFormat(order.payments.reduce((sum, p) => sum + p.amount, 0))}</strong></p>
                        <p style="color: #dc3545;">Pendiente: <strong>${utils.dominicanNumberFormat(order.total.total - order.payments.reduce((sum, p) => sum + p.amount, 0))}</strong></p>
                    ` : ''}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Gracias por su compra. ${businessName || '5SLIM.DO'} - Santo Domingo, República Dominicana.
        </div>

        <script>
            window.onload = function() {
                setTimeout(function() {
                    window.print();
                }, 500);
            };
        </script>
        </body>
        </html>
    
    `
}
