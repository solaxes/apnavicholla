const express = require('express');

const app = express();

app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
  ]);
});

app.post("/api/users", (req, res) => {
  res.send("Data successfully saved to the database");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
 });

