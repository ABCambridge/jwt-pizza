import { test, expect } from 'playwright-test-coverage';
import { mockFranchiseGet, mockMenuGet } from './test-utils';

function randomName() {
    return Math.random().toString(36).substring(2, 12);
}

test( "franchise page - no auth", async ( { page } ) => {
    await page.goto('http://localhost:5173/');
  
    // view franchise page of non-franchise-owner
    await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
    await expect(page.getByText('So you want a piece of the')).toBeVisible();
    await expect(page.getByRole('link', { name: '-555-5555' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Unleash Your Potential' })).toBeVisible();
} );

test( "about page - no auth", async ( { page } ) => {
    await page.goto('http://localhost:5173/');
  
    // visit the about page
    await page.getByRole('link', { name: 'About' }).click();
    await expect(page.getByText('The secret sauce')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
} );

test( "404 page - no auth", async ( { page } ) => {
    await page.goto('http://localhost:5173/');
  
    // go to non existent page
    await page.goto( "http://localhost:5173/404");
    await expect(page.getByText('Oops')).toBeVisible();
    await expect(page.getByRole('link', { name: '404' })).toBeVisible();
    await expect(page.getByText('It looks like we have dropped')).toBeVisible();

    // return to the home page
    await expect(page.getByRole('link', { name: 'home' })).toBeVisible();
    await page.getByRole('link', { name: 'home' }).click();
} );

test( "start order - no auth", async ( { page } ) => {
    await mockMenuGet( page );
    await mockFranchiseGet( page );
    await page.goto('http://localhost:5173/');

    // start on order while not logged in
    await page.getByRole('link', { name: 'Order' }).click();
    await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
    await page.getByRole('combobox').selectOption('1');
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('main').getByText('Register')).toBeVisible();

    await page.getByRole('main').getByText('Register').click();
    await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Full name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Register' })).toBeVisible();
})