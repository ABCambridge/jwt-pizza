import { test, expect } from 'playwright-test-coverage';

test( "home page", async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toBe('JWT Pizza');
  await expect( page.getByRole("button", { name: "Order now" } )).toBeVisible();
  await page.getByRole("button", { name: "Order now" } ).click();
  expect( page.url() ).toEqual( "http://localhost:5173/menu" );
});

test( "login and order pizza", async ( { page } ) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('link', { name: 'Order' }).click();
    await expect( page.getByRole('heading', { name: "Awesome is a click away" } ) ).toBeVisible();
    await page.getByRole('link', { name: "Pepperoni"}).click();
    await page.getByRole('link', { name: "Margarita"}).click();
    await page.getByRole('link', { name: "Logout" } ).click();
});

function randomName() {
  return Math.random().toString(36).substring(2, 12);
}

test( "manage franchises and stores", async ( { page } ) => {
  // login
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

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
  const randStore = randomName();
  await page.getByRole('textbox', { name: 'store name' }).fill( randStore );
  await page.getByRole('button', { name: 'Create' }).click();

  // confirm store is made
  await expect( page.getByRole('cell', { name: randStore }) ).toBeVisible()
} );