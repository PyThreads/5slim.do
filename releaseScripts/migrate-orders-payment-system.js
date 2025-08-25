// 2. Actualizar todos los artículos con el campo articleSearch
db.ARTICLES.find({}).forEach(function(article) {
    var description = article.description || '';
    var internalCode = article._id || '';
    var externalCode = article.externalCode || '';
    var articleSearch = (description + ' ' + internalCode + ' ' + externalCode).trim();
    
    db.ARTICLES.updateOne(
        { _id: article._id },
        { $set: { articleSearch: articleSearch } }
    );
});


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