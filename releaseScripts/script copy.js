

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
        "firstName" : "Deivi",
        "lastName" : "Roque",
        "fullName" : "Lucia Figuereo",
        "email" : "contacttojosereyes@gmail.com",
        "profilePicture" : "https://imagedelivery.net/CX38V24nwkmn2S2w867q4w/e35c2985-cd64-4673-200b-886744a59f00/public",
        "userType" : "Cliente",
        "ownerId" : idSet
    }
);
