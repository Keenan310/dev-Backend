import { Injectable } from "@nestjs/common";
import { FlightSearchModel } from "./dto/search-flight.dto";
import * as puppeteer from 'puppeteer';
import { authenticator } from 'otplib';

@Injectable()
export class CHScraper {
    constructor() {}

    async shopping(flightDto : FlightSearchModel){
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null, // allow fullscreen
    args: ['--start-maximized'] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });

        // 1. Go to login page
        await page.goto('https://trade.newchoudhary.com/', { waitUntil: 'networkidle2' });

        // 2. Fill login form
        await page.type('input[name="email"]', 'flykashan@gmail.com');
        await page.type('input[name="password"]', 'KTT@123456');

        // 3. Submit login
        await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        const otp = '123456';
        const inputSelector = '#mfaActivationCodeId';
        const submitBtnSelector = '.login_btn';

        // Wait for the input to appear
        await page.click(inputSelector);

        // Type OTP using keyboard (triggers key events so Vue v-model updates)
        await page.keyboard.type(otp, { delay: 100 }); // delay simulates human typing

        // Optional: read back value for confirmation
        const value = await page.$eval(inputSelector, el => (el as HTMLInputElement).value);
        console.log('Input value in DOM:', value);


        // const secret = 'UC2EK4Y2B345ZTD2VDPZDPXHSYF7ROPSQ2PL3VXE2WZ3RJX7MO3A';

        // // Generate OTP
        // const otp = authenticator.generate(secret);
        // console.log('Current OTP:', otp);
    

        // Then click login
        await page.click('#login_btn');

        // 4. Navigate to flight search page
        await page.goto('https://trade.newchoudhary.com/flight/flight-search-result.html?nc=Q0xJXzIwOTYz&flight=/DAC-DXB-11|11|2025/1-0-0-Y-all-50-F-O-F--AF-0-11|3|2|12|22|27', { waitUntil: 'networkidle2' });

        await page.waitForSelector('.fa.fa-times', { visible: true });
        await page.click('.fa.fa-times');

        await Promise.all([
        page.click('.select-button'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        await page.waitForSelector('.flight-list');

        // Scrape all flight elements
        const flights = await page.evaluate(() => {
        const flightNodes = document.querySelectorAll('.flight-list .flights');
        const flightData: string[] = [];
        
        flightNodes.forEach((node) => {
            flightData.push(node.textContent?.trim() || '');
        });

        return flightData;
        });

        console.log(flights);


        //await browser.close();
        //return results['LOL'];
    }

}
