"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHScraper = void 0;
const common_1 = require("@nestjs/common");
const puppeteer = require("puppeteer");
let CHScraper = class CHScraper {
    constructor() { }
    async shopping(flightDto) {
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null,
            args: ['--start-maximized'] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('https://trade.newchoudhary.com/', { waitUntil: 'networkidle2' });
        await page.type('input[name="email"]', 'flykashan@gmail.com');
        await page.type('input[name="password"]', 'KTT@123456');
        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        const otp = '123456';
        const inputSelector = '#mfaActivationCodeId';
        const submitBtnSelector = '.login_btn';
        await page.click(inputSelector);
        await page.keyboard.type(otp, { delay: 100 });
        const value = await page.$eval(inputSelector, el => el.value);
        console.log('Input value in DOM:', value);
        await page.click('#login_btn');
        await page.goto('https://trade.newchoudhary.com/flight/flight-search-result.html?nc=Q0xJXzIwOTYz&flight=/DAC-DXB-11|11|2025/1-0-0-Y-all-50-F-O-F--AF-0-11|3|2|12|22|27', { waitUntil: 'networkidle2' });
        await page.waitForSelector('.fa.fa-times', { visible: true });
        await page.click('.fa.fa-times');
        await Promise.all([
            page.click('.select-button'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);
        await page.waitForSelector('.flight-list');
        const flights = await page.evaluate(() => {
            const flightNodes = document.querySelectorAll('.flight-list .flights');
            const flightData = [];
            flightNodes.forEach((node) => {
                flightData.push(node.textContent?.trim() || '');
            });
            return flightData;
        });
        console.log(flights);
    }
};
exports.CHScraper = CHScraper;
exports.CHScraper = CHScraper = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CHScraper);
//# sourceMappingURL=chtravel.flights.service.js.map