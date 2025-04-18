import { test, expect } from 'playwright-test-coverage';
import * as mocks from './test-utils';

test( "register and order", async ( { page } ) => {  
  await mocks.mockMenuGet( page );
  await mocks.mockFranchiseAPICall( page );
  await mocks.mockOrderAPICall( page );
  await mocks.mockAuthAPICall( page );
  await page.goto('/');

  // Register and place an order
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  await expect(page.getByRole('link').getByText('Login')).toBeVisible();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill( mocks.testUserName );
  await page.getByRole('textbox', { name: 'Full name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Email address' }).fill( mocks.testEmail );
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill( mocks.testPassword );

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