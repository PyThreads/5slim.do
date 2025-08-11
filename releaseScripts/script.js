db.getCollection("ARTICLES").updateMany({},{
  $set: {stockAlert: 3}
})