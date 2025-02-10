import { test, expect } from 'playwright-test-coverage';

test( "home page", async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('JWT Pizza');
});

test( "login and order pizza", async ( { page } ) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('link', { name: 'Order' }).click();
    await expect( page.url() ).toEqual( "http://localhost:5173/menu" );
    await page.getByRole('link', { name: "Pepperoni"}).click();
    await page.getByRole('link', { name: "Margarita"}).click();
});