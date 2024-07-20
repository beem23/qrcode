import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [logo, setLogo] = useState(null);
  const [qrCode, setQrCode] = useState('');

  const generateQRCode = async () => {
    try {
      console.log('Sending request with:', { url, foregroundColor, backgroundColor, logo });
      
      const formData = new FormData();
      formData.append('url', url);
      formData.append('foregroundColor', foregroundColor);
      formData.append('backgroundColor', backgroundColor);
      if (logo) {
        formData.append('logo', logo, logo.name);
      }

      const response = await axios.post('https://qrcode-backend.marlonbellot.com/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Received response:', response.data);

      setQrCode(response.data.src);
    } catch (error) {
      console.error('Error generating QR code', error);
    }
  };

  const downloadQRCode = () => {
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="App">
      <div className="hero">
        <h1>Welcome to QR Code Generator-inator</h1>
        <p>Create your customized QR codes quickly and easily!</p>
      </div>
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="url">Enter URL:</label>
          <input
            type="text"
            id="url"
            placeholder="https://example.com or www.example.com or example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="foregroundColor">Pick Foreground Color:</label>
          <input
            type="color"
            id="foregroundColor"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="backgroundColor">Pick Background Color:</label>
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="logo">Upload Logo:</label>
          <input
            type="file"
            id="logo"
            onChange={(e) => setLogo(e.target.files[0])}
          />
        </div>
        <button onClick={generateQRCode}>Generate QR Code</button>
      </div>
      {qrCode && (
        <div>
          <img src={qrCode} alt="QR Code" />
          <button onClick={downloadQRCode}>Download QR Code</button>
        </div>
      )}
    </div>
  );
}

export default App;
