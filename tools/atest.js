const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        //defaultViewport: null,
        args: [
            '--window-size=1200,800',
        ],
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await new Promise(async function (resolve) {
        page.on('console', async function (message) {
            var event;
            var text = message.text();
            try {
                event = JSON.parse(text);
                if (event.length !== 2) {
                    event = null;
                }
            } catch (e) {
                event = null;
            }

            if (event) {
                var eventName = event[0];
                var eventData = event[1];

                if (eventName === "end") {
                    console.log("Passes: ", eventData.passes);
                    console.log("Failures: ", eventData.failures);
                    console.log("Duration: ", eventData.duration);

                   await browser.close();
                   process.exit(eventData.failures ? 1 : 0);
                   resolve();
                } else if (eventName === "fail") {
                    console.log("fail", eventData.fullTitle);
                    console.log(eventData.err);
                    console.log(eventData.stack);
                } else if (eventName === "pass") {
                    console.log("pass", eventData.fullTitle);
                }
            } else {
                console.log(text);
            }

        });
        await page.goto('http://localhost:8001/acceptance.html?dev=true&reporter=json-stream');
    });

})();