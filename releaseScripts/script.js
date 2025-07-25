db.getCollection("0RDER").updateMany(
    { createdDate: { $type: "string" } },
    [{ $set: { createdDate: { $toDate: "$createdDate" } } }]
)