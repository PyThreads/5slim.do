// Migración para el nuevo sistema de pagos
// Este script actualiza las órdenes existentes para usar el nuevo sistema

db.getCollection("0RDER").updateMany(
    {}, // Match all orders
    [
        {
            $set: {
                // Add new fields
                orderType: "Contado", // All existing orders are cash orders
                paymentStatus: "Pagado",
                payments:  [
                            {
                                paymentDate: "$createdDate",
                                amount: "$total.total",
                                method: {
                                    $switch: {
                                        branches: [
                                            { case: { $eq: ["$paymentType", "Efectivo"] }, then: "Efectivo" },
                                            { case: { $eq: ["$paymentType", "Tarjeta"] }, then: "Tarjeta" },
                                            { case: { $eq: ["$paymentType", "Transferencia"] }, then: "Transferencia" }
                                        ],
                                        default: "Efectivo"
                                    }
                                },
                                reference: null,
                                notes: "Migración automática - pago registrado al crear la orden",
                                createdBy: "$createdBy"
                            }
                ]
            }
        }
    ]
);