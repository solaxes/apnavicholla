const mongoose = require('mongoose');
const URI =
  "mongodb+srv://solaxes:WPrXFw2Y4ttmkaKy@solaxesnode.6hqohqa.mongodb.net/?retryWrites=true&w=majority&appName=SolaxesNode";

  const URI_NEW = "mongodb+srv://solaxes:WPrXFw2Y4ttmkaKy@solaxesnode.6hqohqa.mongodb.net/HelloWorld";

const connectDB = async () => {
    await mongoose.connect(URI_NEW);
};

// connectDB()
//     .then(() => {
//         console.log("MongoDB connected");
//     })
//     .catch((err) => {
//         console.log(err);
// });

module.exports = connectDB;



