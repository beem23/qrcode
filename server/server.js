const express = require('express');
const bodyParser = require('body-parser');
const qr = require('qrcode');
const cors = require('cors');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', (req, res) => {
    const url = req.body.url;
    if (url.length === 0) res.send('Empty Data!');

    qr.toDataURL(url, (err, src) => {
        if (err) res.send('Error occurred');

        res.json({ src });
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
