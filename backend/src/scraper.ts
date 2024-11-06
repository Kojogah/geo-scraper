import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(__dirname, 'data.json');

interface Product {
    title: string;
    price: string | null;
    rating: string | null;
    image: string;
    link: string;
}

export async function ScrapeAndSaveProducts(categoryUrl: string): Promise<void> {
    try {
        const {data} = await axios.get(categoryUrl, {
            headers: {
                'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.5938.92 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://www.amazon.com/',
                'DNT': '1',
        },
    });

    const $ = cheerio.load(data);
    const products: Product[] = [];

    $('.s-result-item').each((_, element) => {
        const title = $(element).find('h2 a span').text().trim();
        const price = $(element).find('.a-price span.a-offscreen').first().text() || null;
        const rating = $(element).find('.a-icon-alt').text() || null;
        const image = $(element).find('.s-image').attr('src') || '';
        const link = 'https://www.amazon.com' + $(element).find('h2 a').attr('href');

        if (title) {
        products.push({title, price, rating, image, link});
        }
    });

    console.log(`Found ${products.length} products`);

    await fs.writeFile(dataPath, JSON.stringify(products, null, 2), 'utf-8');
    console.log('Data written to data.json');
    } 
    catch (error) {
    console.error('Error scraping or saving data:', error);
    }
}
