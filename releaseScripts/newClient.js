

var result = db.getCollection("ADMIN").find().sort({_id: -1})

var idSet

if (result.hasNext()) {
    var lastDocument = result.next();
    idSet = lastDocument._id + 1;
    print("El último ID es:", lastId);
}

db.getCollection("ADMIN").insertOne(
    {
        "_id" : idSet,
        "firstName" : "",
        "lastName" : "",
        "fullName" : "",
        "email" : "",
        "profilePicture" : "",
        "userType" : "Cliente",
        "ownerId" : idSet
    }
);
