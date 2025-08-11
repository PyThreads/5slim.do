// Migración para convertir available de boolean a string y agregar comentario
db.getCollection("ARTICLES").updateMany({},{
  $set: {stockAlert: 3}
})

// Convertir available de boolean a string en todas las variantes
db.getCollection("ARTICLES").aggregate([
  { $match: { "variants.available": { $exists: true } } },
  { $unwind: "$variants" },
  {
    $addFields: {
      "variants.available": {
        $cond: {
          if: { $eq: ["$variants.available", true] },
          then: "Disponible",
          else: {
            $cond: {
              if: { $and: [{ $eq: ["$variants.available", false] }, { $eq: ["$variants.stock", 1] }] },
              then: "Encargado",
              else: "No disponible"
            }
          }
        }
      },
      "variants.comment": ""
    }
  },
  {
    $group: {
      _id: "$_id",
      variants: { $push: "$variants" },
      root: { $first: "$$ROOT" }
    }
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          { $arrayToObject: { $filter: { input: { $objectToArray: "$root" }, cond: { $ne: ["$$this.k", "variants"] } } } },
          { variants: "$variants" }
        ]
      }
    }
  },
  { $out: "ARTICLES" }
]).toArray()

// Para variantes sin campo available, establecer como "Disponible"
db.getCollection("ARTICLES").updateMany(
  { "variants.available": { $exists: false } },
  {
    $set: {
      "variants.$[].available": "Disponible",
      "variants.$[].comment": ""
    }
  }
)