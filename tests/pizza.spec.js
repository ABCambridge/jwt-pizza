import { test, expect } from 'playwright-test-coverage';
import * as mocks from './test-utils';

async function login( page ) {
  await page.goto('/');
  await page.getByRole( 'link', { name: 'Login' } ).click();

  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Email address' }).fill( mocks.testEmail );
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill( mocks.testPassword );

  const loginResponse = page.waitForResponse( '**/*/api/auth');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await loginResponse;
  await page.goto('/');
}

async function logout( page ) {
  await page.goto('/');
  const logoutButton = await page.getByRole( 'link', { name: 'Logout' } );
  await expect( logoutButton ).toBeVisible();

  const logoutResponse = page.waitForResponse( '**/*/api/auth');
  await logoutButton.click();
  await logoutResponse;
  await expect( page.getByRole('link', { name: 'login' } ) ).toBeVisible()
}

test.describe.configure({mode: 'serial'});

test( "home page", async ( { page } ) => {
  await mocks.mockMenuGet( page );
  await mocks.mockFranchiseAPICall( page );

  await page.goto('/');
  expect(await page.title()).toBe('JWT Pizza');
  await expect( page.getByRole("button", { name: "Order now" } )).toBeVisible();
  await page.getByRole("button", { name: "Order now" } ).click();
  expect( page.url() ).toEqual( "http://localhost:5173/menu" );
});

test( "login and logout", async ( { page } ) => {
  await mocks.mockAuthAPICall( page );
  // Login
  await login( page );
  await logout( page );
});

test( "order pizza", async ( { page } ) => {
  await mocks.mockAuthAPICall( page );
  await mocks.mockMenuGet( page );
  await mocks.mockOrderAPICall( page );
  await mocks.mockOrderVerificationAPICall( page );
  await mocks.mockFranchiseAPICall( page );
  await login( page );

  // Order pizzas
  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
  await expect(page.getByText('What are you waiting for?')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Pepperoni' })).toBeVisible();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Pay now' }).click();
  const verifyResponse = page.waitForResponse( '**/*/api/order/verify');
  await page.getByRole('button', { name: 'Verify' }).click();
  await verifyResponse;
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('button', { name: 'Order more' })).toBeVisible();
  
  await logout( page );
});

test( "create franchise and stores", async ( { page } ) => {
  await mocks.mockAuthAPICall( page );
  await mocks.mockFranchiseAPICall( page );
  await login( page );  

  async function createFranchise() {
    // create a franchise
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect( page.getByRole('button', { name: 'Add Franchise' }) ).toBeVisible();
    await page.getByRole('button', { name: 'Add Franchise' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).click();
    await page.getByRole('textbox', { name: 'franchise name' }).fill( mocks.testFranchiseName );
    await page.getByRole('textbox', { name: 'franchisee admin email' }).fill( mocks.testEmail );
    const createFranchisePromise = page.waitForResponse('**/*/api/franchise');
    await page.getByRole('button', { name: 'Create' }).click();
    await createFranchisePromise;

    // confirm franchise is made
    await expect( page.getByRole('cell', { name: mocks.testFranchiseName }) ).toBeVisible();
  }
  await createFranchise();

  // create a  store for the franchise
  await page.getByRole('link', { name: 'Franchise' }).click();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill( mocks.testStoreName );
  const creatStorePromise = page.waitForResponse('**/*/api/franchise/1/store');
  await page.getByRole('button', { name: 'Create' }).click();
  await creatStorePromise;

  // confirm stores are made
  await expect( page.getByRole('cell', { name: mocks.testStoreName }) ).toBeVisible()
  // close a store
  await page.getByRole('button', { name: 'Close' }).nth(0).click();
  await page.getByRole('button', { name: 'Close' }).click();

  await createFranchise();
  // close the franchise
  await expect(page.getByRole('cell', {name: mocks.testFranchiseName })).toBeVisible();
  await page.getByRole('button', { name: 'Close' } ).nth(0).click();
  const deletePromise = page.waitForResponse('**/*/api/franchise/1');
  await page.getByRole('button', {name:'Close'}).click();
  await deletePromise;

  await logout( page );
});