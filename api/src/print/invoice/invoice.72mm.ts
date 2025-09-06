import { IArticleCart, IOrder, IOrderDiscountType } from "../../interfaces"
import { utils } from "../../utils"

export const invoice72mm = async ({ order, logo, businessName }: { order: IOrder, logo: string, businessName?: string }) => {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Factura 72mm</title>
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
                size: 72mm auto;
            }

            html, body {
            width: 72mm;
            background: #fff;
            font-size: 11px;
            line-height: 1.3;
            font-weight: 900;
            }

            .center { text-align: center; }
            .bold { font-weight: 900; }
            .line { border-bottom: 2px dashed #000; margin: 4px 0; }
            
            .header {
            text-align: center;
            margin-bottom: 10px;
            }
            
            .logo {
            width: 30px;
            height: auto;
            margin-bottom: 4px;
            }
            
            .store-name {
            font-size: 16px;
            font-weight: 900;
            margin-bottom: 3px;
            }
            
            .invoice-info {
            font-size: 10px;
            font-weight: 900;
            margin-bottom: 6px;
            }
            
            .customer {
            margin-bottom: 10px;
            font-size: 10px;
            font-weight: 900;
            }
            
            .items {
            margin-bottom: 10px;
            }
            
            .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
            font-size: 9px;
            font-weight: 900;
            }
            
            .item-name {
            flex: 1;
            margin-right: 6px;
            }
            
            .item-qty {
            width: 25px;
            text-align: center;
            }
            
            .item-price {
            width: 60px;
            text-align: right;
            }
            
            .totals {
            margin-top: 6px;
            font-size: 10px;
            font-weight: 900;
            }
            
            .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2px;
            }
            
            .final-total {
            font-weight: 900;
            font-size: 12px;
            border-top: 2px solid #000;
            padding-top: 3px;
            margin-top: 4px;
            }
            
            .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 8px;
            font-weight: 900;
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
            <div style="border-bottom: 2px solid #000; margin: 3px 0;"></div>
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
                    <div class="item-name">${articleName.substring(0, 30)}${articleName.length > 30 ? '...' : ''}</div>
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