const https = require('https');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'downloads');

function downloadPdf(href, name, time)  {
    https.get(href, response => {
        if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        }
        const fileStream = fs.createWriteStream(path.join(filePath, name + "_" + time + ".pdf"));
        response.pipe(fileStream);
        fileStream.on('finish', () => {
        fileStream.close(); 
        });
    });
};

module.exports = {
    downloadPdf
  };