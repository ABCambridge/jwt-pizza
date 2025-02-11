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

    // Login
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Order pizzas
    await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
    await page.getByRole('link', { name: 'Order' }).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await expect(page.getByText('Awesome is a click away')).toBeVisible();
    await expect(page.getByText('What are you waiting for?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Image Description Pepperoni' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Image Description Margarita' })).toBeVisible();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await page.getByRole('link', { name: 'Image Description Margarita' }).click();
    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('button', { name: 'Checkout' }).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.getByRole('button', { name: 'Pay now' }).click();
    await page.getByRole('button', { name: 'Verify' }).click();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Order more' }).click();

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
    // close store
    await page.getByRole('row', { name: `${randStore} 0 ₿ Close` }).getByRole('button').click();
    await page.getByRole('button', { name: 'Close' }).click();
    await new Promise(resolve => setTimeout(resolve, 500));
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByRole('row', { name: `${randFranchise} 常用名字 Close` }).getByRole('button').click();
    await page.getByRole('button', { name: 'Close' }).click();

    await page.getByRole('link', { name: "Logout" } ).click();
});

function randomName() {
  return Math.random().toString(36).substring(2, 12);
}

test( "no auth pages", async ( { page } ) => {
  await page.goto('http://localhost:5173/');

  // view franchise page of non-franchise-owner
  await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('So you want a piece of the')).toBeVisible();
  await expect(page.getByRole('link', { name: '-555-5555' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Unleash Your Potential' })).toBeVisible();

  // visit the about page
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByText('The secret sauce')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();

  // return to the home page
  await expect(page.getByRole('link', { name: 'home' })).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();

  // visit the register page
  await page.getByRole('link', { name: 'Register' }).click();
  await expect(page.getByRole('main').getByText('Login')).toBeVisible();

  // start on order while not logged in
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('main').getByText('Register')).toBeVisible();

  // go to non existent page
  // await page.goto( "http://locatlhost:5173/bad-page")
} );