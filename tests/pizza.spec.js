import { test, expect } from 'playwright-test-coverage';

function randomName() {
  return Math.random().toString(36).substring(2, 12);
}

test.describe.configure({mode: 'serial'});

/** @type {import('@playwright/test').Page} */
let page; // to be the the page used by this file's tests

test.beforeAll( async ( { browser } ) => {
  page = await browser.newPage();
} );

test.afterAll( async () => {
  await page.close();
})

test( "home page", async () => {
  await page.goto('/');
  expect(await page.title()).toBe('JWT Pizza');
  await expect( page.getByRole("button", { name: "Order now" } )).toBeVisible();
  await page.getByRole("button", { name: "Order now" } ).click();
  expect( page.url() ).toEqual( "http://localhost:5173/menu" );
});

test( "login", async () => {
  // Login
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');

  const loginResponse = page.waitForResponse( '**/*/api/auth');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await loginResponse;
});

test( "order pizza", async () => {
    // Order pizzas
    await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
    await page.getByRole('link', { name: 'Order' }).click();
    await expect(page.getByText('Awesome is a click away')).toBeVisible();
    await expect(page.getByText('What are you waiting for?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Image Description Pepperoni' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Image Description Margarita' })).toBeVisible();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await page.getByRole('link', { name: 'Image Description Margarita' }).click();
    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.getByRole('button', { name: 'Pay now' }).click();
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Order more' }).click();
});

test( "create franchise and stores", async () => {

  // create a franchise
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  const randFranchise = randomName()
  await page.getByRole('textbox', { name: 'franchise name' }).fill( randFranchise );
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('a@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  // confirm franchise is made
  await expect( page.getByRole('cell', { name: randFranchise }) ).toBeVisible();

  // create a  store for the franchise
  await page.getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  const randStore1 = randomName();
  await page.getByRole('textbox', { name: 'store name' }).fill( randStore1 );
  await page.getByRole('button', { name: 'Create' }).click();

  // create a second store
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  const randStore2 = randomName();
  await page.getByRole('textbox', { name: 'store name' }).fill( randStore2 );
  await page.getByRole('button', { name: 'Create' }).click();

  // confirm stores are made
  await expect( page.getByRole('cell', { name: randStore1 }) ).toBeVisible()
  await expect( page.getByRole('cell', { name: randStore2 }) ).toBeVisible()
  // close a store
  await page.getByRole('row', { name: `${randStore1} 0 ₿ Close` }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();

  // close the franchise
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('button', {name: 'Close'}).nth(1)).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).nth(1).click();
  // await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('link', { name: "Logout" } ).click();
  await expect( page.getByRole('link', { name: 'login' } ) ).toBeVisible()
});