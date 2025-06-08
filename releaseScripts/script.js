
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
        fullName: "Lucia Figuereo",
        email: "luciagfiguereo@gmail.com"
    }
]


db.getCollection("ADMIN").insertMany(adminList)