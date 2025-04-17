const express = require('express');

const app = express();
app.use('/about', (req, res) => {
    res.send("This is about us page");
    return;
});
app.use('/home', (req, res) => {
    res.send('Welcome to the home page');
    return;
});
app.use('/contact', (req, res) => {
    res.send('Welcome to the contact page');
    return;
});

app.use("/api/users", (req, res) => {
    res.json([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Doe' }
    ]);
    return;
});

app.use((req, res) => {
    res.send('Hello World!');
    return;
});





app.listen(3000, () => {
    console.log('Server is running on port 3000');
 });

