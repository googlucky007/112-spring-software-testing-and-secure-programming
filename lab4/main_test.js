const puppeteer = require('puppeteer');

(async () => {
    // 啟動瀏覽器並開啟新的空白頁面
    // const browser = await puppeteer.launch({headless:false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
    const browser = await puppeteer.launch();
  
    const page = await browser.newPage();

    // 將頁面導覽到某個 URL
    await page.goto('https://pptr.dev/');

    // 設定螢幕尺寸
    await page.setViewport({width: 1080, height: 1024});

    // 等待並點擊第一個結果
    const button = await page.waitForSelector('.DocSearch-Button', {visible: true});
    await button.click();

    // 在搜尋框中輸入
    const input = await page.waitForSelector('#docsearch-input', {visible: true});
    await input.type('chipi chipi chapa chapa');
    await new Promise(resolve => setTimeout(resolve, 1000));

    //透過id來識別元素
    const selector = await page.waitForSelector('#docsearch-item-5');
    const handle = await selector.$$('a');
    const propertyHandles = await Promise.all(handle.map(h => h.getProperty('href')));
    const targetHref = await Promise.all(propertyHandles.map(h => h.jsonValue()));
	
    //導航到targetHref數組中的第一個 URL 並等待頁面完全加載，再繼續執行進一步操作
    await page.goto(targetHref[0]);

    // 使用 CSS 選擇器擷取單一元素
	// 選擇器範例：h1
    const element = await page.$('h1'); 

    // 擷取並記錄元素的文字內容
    const elementText = await page.evaluate(element => element.textContent, element);
    console.log(elementText);

    await browser.close();
})();
