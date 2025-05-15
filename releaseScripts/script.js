
var adminList = [
   {
        _id: 1,
        name: "Jose",
        lastName: "Reyes",
        fullName: "Jose Reyes",
        email: "josereyes@pythreads.com"
    }
]


db.getCollection("ADMIN").insertMany(adminList)