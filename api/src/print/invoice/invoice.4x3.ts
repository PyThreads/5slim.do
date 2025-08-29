import { IArticleCart, IOrder, IOrderDiscountType } from "../../interfaces"
import { utils } from "../../utils"

export const invoice4x3 = async ({ order, logo, businessName }: { order: IOrder, logo: string, businessName?: string }) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Factura 4x3</title>
        <style>
            * {
            margin: 0;
            padding: 0;
            border: 0;
            box-sizing: border-box;
            font-family: 'Courier New', monospace;
            color: #000;
            }

            @page {
            size: 4in 3in;
            margin: 0.1in;
            }

            html, body {
            width: 100%;
            height: 100%;
            background: #fff;
            font-size: 9px;
            line-height: 1.2;
            }

            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-bottom: 1px dashed #000; margin: 3px 0; }
            
            .header {
            text-align: center;
            margin-bottom: 8px;
            }
            
            .logo {
            width: 25px;
            height: auto;
            margin-bottom: 3px;
            }
            
            .store-name {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 2px;
            }
            
            .invoice-info {
            font-size: 8px;
            margin-bottom: 5px;
            }
            
            .customer {
            margin-bottom: 8px;
            font-size: 8px;
            }
            
            .items {
            margin-bottom: 8px;
            }
            
            .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
            font-size: 7px;
            }
            
            .item-name {
            flex: 1;
            margin-right: 5px;
            }
            
            .item-qty {
            width: 20px;
            text-align: center;
            }
            
            .item-price {
            width: 50px;
            text-align: right;
            }
            
            .totals {
            margin-top: 5px;
            font-size: 8px;
            }
            
            .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1px;
            }
            
            .final-total {
            font-weight: bold;
            font-size: 10px;
            border-top: 1px solid #000;
            padding-top: 2px;
            margin-top: 3px;
            }
            
            .footer {
            text-align: center;
            margin-top: 8px;
            font-size: 6px;
            }
        </style>
        </head>
        <body>

        <div class="header">
            <img class="logo" src="${logo}" alt="Logo" />
            <div class="store-name">${businessName || '5SLIM.DO'}</div>
            <div class="invoice-info">
                FACTURA #${order._id}<br>
                ${utils.formatAmPmLetters(order.createdDate)}
            </div>
        </div>

        <div class="line"></div>

        <div class="customer">
            <div class="bold">CLIENTE:</div>
            ${order.client.fullName}<br>
            ${order.client.address ? utils.fullAddress(order.client.address) : 'N/A'}<br>
            Tel: ${order.client.address?.phone || order.client.phone || 'N/A'}
        </div>

        <div class="line"></div>

        <div class="items">
            <div class="item-row bold">
                <div class="item-name">ARTICULO</div>
                <div class="item-qty">QTY</div>
                <div class="item-price">TOTAL</div>
            </div>
            <div style="border-bottom: 1px solid #000; margin: 2px 0;"></div>
            ${order.articles.map((article: IArticleCart) => {
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
                  <div class="item-row">
                    <div class="item-name">${articleName.substring(0, 35)}${articleName.length > 35 ? '...' : ''}</div>
                    <div class="item-qty">${article.variant.stock}</div>
                    <div class="item-price">${utils.dominicanNumberFormat(itemTotal)}</div>
                  </div>
                `;
              }).join('')}
        </div>

        <div class="line"></div>

        <div class="totals">
            <div class="total-row">
                <span>SUBTOTAL:</span>
                <span>${utils.dominicanNumberFormat(order.total.subTotal)}</span>
            </div>
            ${order.total.discount > 0 ? `
            <div class="total-row">
                <span>DESCUENTO:</span>
                <span>-${utils.dominicanNumberFormat(order.total.discount)}</span>
            </div>
            ` : ''}
            <div class="total-row final-total">
                <span>TOTAL:</span>
                <span>${utils.dominicanNumberFormat(order.total.total)}</span>
            </div>
            ${order.payments && order.payments.length > 0 ? `
            <div class="total-row" style="color: #28a745;">
                <span>PAGADO:</span>
                <span>${utils.dominicanNumberFormat(order.payments.reduce((sum, p) => sum + p.amount, 0))}</span>
            </div>
            <div class="total-row" style="color: #dc3545;">
                <span>PENDIENTE:</span>
                <span>${utils.dominicanNumberFormat(order.total.total - order.payments.reduce((sum, p) => sum + p.amount, 0))}</span>
            </div>
            ` : ''}
        </div>

        <div class="line"></div>

        <div class="footer">
            GRACIAS POR SU COMPRA<br>
            Santo Domingo, RD
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