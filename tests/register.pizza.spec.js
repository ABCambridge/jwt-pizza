import { test, expect } from 'playwright-test-coverage';

test.describe.configure({mode: 'serial'});

/** @type {import('@playwright/test').Page} */
let page; // to be the the page used by this file's tests

test.beforeAll( async ( { browser } ) => {
  page = await browser.newPage();
} );

test.afterAll( async () => {
  await page.close();
})

function randomName() {
    return Math.random().toString(36).substring(2, 12);
}

test( "register", async () => {  
  await page.goto('/');

  // Register and place an order
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  await expect(page.getByRole('link').getByText('Login')).toBeVisible();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill(randomName());
  await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email address' }).fill('rand@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill(randomName());

  const registerPromise = page.waitForResponse('**/*/api/auth');
  await page.getByRole('button', { name: 'Register' }).click();
  await registerPromise;
} );

test( "order", async () => {
  await expect(page.getByRole('link', {name: 'Order'})).toBeVisible()
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByRole('button', { name: 'Verify' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Order more' })).toBeVisible();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
} ); 