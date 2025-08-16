// Variable para el ownerId que se asignará a todos los documentos
var OWNER_ID = 1;

db.getCollection("ADMIN").updateMany(
    {_id: {$ne: OWNER_ID}},
    { $set: { userType: "Empleado" } }
);

// Actualizar colección ADMIN
db.getCollection("ADMIN").updateMany(
    {},
    { $set: { ownerId: OWNER_ID } }
);

// Actualizar colección CLIENTS
db.getCollection("CLIENTS").updateMany(
    {},
    { $set: { ownerId: OWNER_ID } }
);

// Actualizar colección ARTICLES
db.getCollection("ARTICLES").updateMany(
    {},
    { $set: { ownerId: OWNER_ID } }
);

// Actualizar colección ORDER (nota: el enum tiene "0RDER" con cero)
db.getCollection("0RDER").updateMany(
    {},
    { $set: { ownerId: OWNER_ID } }
);