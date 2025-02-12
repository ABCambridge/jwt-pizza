import { test, expect } from 'playwright-test-coverage';
import { mockMenuGet, mockFranchiseGet, mockOrderPost } from './test-utils';

function randomName() {
    return Math.random().toString(36).substring(2, 12);
}

test( "register and order", async ( { page } ) => {  
  await mockMenuGet( page );
  await mockFranchiseGet( page );
  await mockOrderPost( page );
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