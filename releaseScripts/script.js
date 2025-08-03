db.getCollection("CLIENTS").updateMany(
  { createdDate: { $type: "string" } }, // solo si es string
  [
    {
      $set: {
        createdDate: { $toDate: "$createdDate" }
      }
    }
  ]
)
db.getCollection("CLIENTS").updateMany(
  { updatedDate: { $type: "string" } }, // solo si es string
  [
    {
      $set: {
        updatedDate: { $toDate: "$updatedDate" }
      }
    }
  ]
)

db.getCollection("ARTICLES").updateMany(
  { createdDate: { $type: "string" } }, // solo si es string
  [
    {
      $set: {
        createdDate: { $toDate: "$createdDate" }
      }
    }
  ]
)
db.getCollection("ARTICLES").updateMany(
  { updatedDate: { $type: "string" } }, // solo si es string
  [
    {
      $set: {
        updatedDate: { $toDate: "$updatedDate" }
      }
    }
  ]
)


db.getCollection("ARTICLES").updateMany(
  { "variants.stock": { $gt: 0 } },
  { $set: { "variants.$[elem].available": true } },
  { arrayFilters: [ { "elem.stock": { $gt: 0 } } ] }
)

db.getCollection("ARTICLES").updateMany(
  { "variants.stock": { $lte: 0 } },
  { $set: { "variants.$[elem].available": false } },
  { arrayFilters: [ { "elem.stock": { $lte: 0 } } ] }
)