import { createServer } from 'http';
import { ScrapeAndSaveProducts } from './scraper';
import fs from 'fs/promises';
import path from 'path';

const PORT = 5000;
const dataPath = path.join(__dirname, 'data.json');

const server = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/products' && req.method === 'GET') {
        try {
            const data = await fs.readFile(dataPath, 'utf-8');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        } catch (error) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Error reading data file'}));
        }
    } else if (req.url === '/api/scrape' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { url } = JSON.parse(body);
                await ScrapeAndSaveProducts(url);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Scrape initiated'}));
            } catch (error) {
                res.writeHead(500, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({message: 'Error initiating scrape'}));
            }
        });
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Route not found'}));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
