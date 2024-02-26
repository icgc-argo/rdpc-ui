const pw = require('playwright');

(async () => {
	try {
		const browser = await pw.chromium.connectOverCDP('http://localhost:9222');

		console.log(browser.isConnected() && 'Connected to Chrome.');
		console.log(`Contexts in CDP session: ${browser.contexts().length}.`);

		// Setup context however you like.
		const context = await browser.newContext({
			/* pass any options */
		});
		await context.route('**/*', (route) => route.continue());

		// Pause the page, and start recording manually.
		const page = await context.newPage();
		await page.pause();
	} catch (error) {
		console.log('Cannot connect to Chrome.', error);
	}
})();
