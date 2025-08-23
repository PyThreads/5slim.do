// Script simple para Robo 3T - Convertir fechas a Date por colección

// CATEGORIES
db.CATEGORIES.updateMany(
    { "createdDate": { $exists: true, $type: "string" } },
    [{ $set: { "createdDate": { $toDate: "$createdDate" } } }]
);

db.CATEGORIES.updateMany(
    { "updatedDate": { $exists: true, $type: "string" } },
    [{ $set: { "updatedDate": { $toDate: "$updatedDate" } } }]
);

// CLIENTS
db.CLIENTS.updateMany(
    { "createdDate": { $exists: true, $type: "string" } },
    [{ $set: { "createdDate": { $toDate: "$createdDate" } } }]
);

db.CLIENTS.updateMany(
    { "updatedDate": { $exists: true, $type: "string" } },
    [{ $set: { "updatedDate": { $toDate: "$updatedDate" } } }]
);

// ARTICLES
db.ARTICLES.updateMany(
    { "createdDate": { $exists: true, $type: "string" } },
    [{ $set: { "createdDate": { $toDate: "$createdDate" } } }]
);

db.ARTICLES.updateMany(
    { "updatedDate": { $exists: true, $type: "string" } },
    [{ $set: { "updatedDate": { $toDate: "$updatedDate" } } }]
);

// ORDERS (0RDER)
db["0RDER"].updateMany(
    { "createdDate": { $exists: true, $type: "string" } },
    [{ $set: { "createdDate": { $toDate: "$createdDate" } } }]
);

db["0RDER"].updateMany(
    { "updatedDate": { $exists: true, $type: "string" } },
    [{ $set: { "updatedDate": { $toDate: "$updatedDate" } } }]
);

// ADMIN
db.ADMIN.updateMany(
    { "createdDate": { $exists: true, $type: "string" } },
    [{ $set: { "createdDate": { $toDate: "$createdDate" } } }]
);

db.ADMIN.updateMany(
    { "updatedDate": { $exists: true, $type: "string" } },
    [{ $set: { "updatedDate": { $toDate: "$updatedDate" } } }]
);

// TEMP_CODES
db.TEMP_CODES.updateMany(
    { "createdDate": { $exists: true, $type: "string" } },
    [{ $set: { "createdDate": { $toDate: "$createdDate" } } }]
);