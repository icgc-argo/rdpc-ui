import { expect, test } from '@playwright/test';

test('test', async ({ page }) => {
	const download1Promise = page.waitForEvent('download');
	await page.getByRole('button', { name: 'File Template' }).click();
	const download1 = await download1Promise;
	await page.getByRole('link', { name: 'Register Samples' }).getByRole('button').click();
	await page.getByRole('button', { name: 'Dashboard' }).click();
	await page.getByRole('link', { name: 'Register Samples' }).click();
	const download2Promise = page.waitForEvent('download');
	await page.getByRole('button', { name: 'File Template' }).click();
	const download2 = await download2Promise;
	await page.getByRole('button', { name: 'Upload File' }).click();
	await page
		.getByRole('button', { name: 'Upload File' })
		.setInputFiles('sample_registration_dictionary_v130.0_invalid.tsv');
	await expect(page.getByRole('button', { name: 'Upload File' })).toBeVisible();
	await expect(page.getByText('Register', { exact: true })).toBeVisible();
	await expect(page.locator('body')).toContainText('Register');
	await page.getByRole('button', { name: 'Upload File' }).click();
	await page.getByRole('button', { name: 'Upload File' }).setInputFiles([]);
});
