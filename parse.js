const puppeteer = require('puppeteer');
const { downloadPdf } = require('./downloadPdf');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'downloads');
const data = [];

async function parseFunction (url) {
    const browser = await puppeteer.launch({
        headless: false, 
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
      });
    
      const page = await browser.newPage();
      await page.goto(url);
    
      const block = await page.$$('.list-item');
    
      for(const item of block) {
        if (item != null) {

 // Waitin for a half  second for element appearance
          await item.hover();
          await new Promise(resolve => setTimeout(resolve, 500)); 
    
          const link = await item.$('.pdf');
          if (link) {
            const href = await link.evaluate(el => el.href); 
            const nameElement = await item.$('h3');
            const name = await page.evaluate(element => element.textContent, nameElement);
    
            let index = 0;
            let time;
            const timeElement = await item.$$('time');
            for (const iterator of timeElement) {
              index++;
              if (index %2 == 0) {
                time = await page.evaluate(element => element.textContent, iterator);
              }
            }
    
            const field = {
              name: name,
              date: time,
              pdf: href
            }
            data.push(field);
// Saving pdf files to folder downloads
            downloadPdf(href, name, time); 

          } else {
            break;
          }
          console.log(data);
        } 
      }
// Saving json data to file in folder downloads
    const jsonData = JSON.stringify(data);
    fs.writeFileSync(path.join(filePath, "data.json"), jsonData);
    
    await browser.close();
};

module.exports = {
    parseFunction
};