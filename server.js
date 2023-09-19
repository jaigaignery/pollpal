const express = require('express');
const app = express();
const port = 8383;

app.use(express.static('public'))

//HTTP Routes
app.post('/', (req, res) => {
    res.status(200).send('Hello!!!');
})

app.listen(port, () => console.log(`Server has started on port: ${port}`));