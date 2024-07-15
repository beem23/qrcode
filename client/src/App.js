import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [qrCode, setQrCode] = useState('');

  const generateQRCode = async () => {
    try {
      const response = await axios.post('http://localhost:5001/generate', { url });
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
      <h1>QR Code Generator</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button onClick={generateQRCode}>Generate QR Code</button>
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
