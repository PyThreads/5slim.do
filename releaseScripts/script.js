
var adminList = [
   {
        _id: 1,
        firstName: "Jose",
        lastName: "Reyes",
        fullName: "Jose Reyes",
        email: "josereyes@pythreads.com"
    },
    {
        _id: 2,
        firstName: "Lucia",
        lastName: "Figuereo",
        fullName: "Jose Reyes",
        email: "luciagfiguereo@gmail.com"
    }
]


db.getCollection("ADMIN").insertMany(adminList)