const express = require('express');
const bodyParser = require('body-parser');
const qr = require('qrcode');
const cors = require('cors');
const Jimp = require('jimp');
const multer = require('multer');

const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/generate', upload.single('logo'), async (req, res) => {
    const { url, foregroundColor = '#000000', backgroundColor = '#ffffff', logoSize = 0.2 } = req.body;
    const logo = req.file;

    console.log(`Received request with URL: ${url}, foregroundColor: ${foregroundColor}, backgroundColor: ${backgroundColor}, logo: ${logo ? 'yes' : 'no'}`);

    if (!url) {
        return res.send('Empty Data!');
    }

    try {
        // Generate QR code
        const qrCode = await qr.toDataURL(url, {
            color: {
                dark: foregroundColor,  // QR code foreground color
                light: backgroundColor  // QR code background color
            }
        });

        // If there's no logo, return the generated QR code
        if (!logo) {
            return res.json({ src: qrCode });
        }

        // Process QR code with logo
        const qrImage = await Jimp.read(Buffer.from(qrCode.split(',')[1], 'base64'));
        const logoImage = await Jimp.read(logo.buffer);
        logoImage.resize(qrImage.bitmap.width * logoSize, Jimp.AUTO);

        const x = (qrImage.bitmap.width - logoImage.bitmap.width) / 2;
        const y = (qrImage.bitmap.height - logoImage.bitmap.height) / 2;

        qrImage.composite(logoImage, x, y);
        
        qrImage.getBase64(Jimp.MIME_PNG, (err, src) => {
            if (err) {
                console.error('Error occurred while processing image', err);
                return res.send('Error occurred while processing image');
            }

            res.json({ src });
        });
    } catch (err) {
        console.error('Error occurred', err);
        res.send('Error occurred');
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
