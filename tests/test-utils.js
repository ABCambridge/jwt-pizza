import { test, expect } from 'playwright-test-coverage';

export async function mockMenuGet( currentPage ) {
    /** @type {import('@playwright/test').Page} */
    let page = currentPage;

    await page.route('*/**/api/order/menu', async ( route ) => {
        expect( route.request().method()).toBe('GET');
        const menu_response = [
            {
              "id": 1,
              "title": "Veggie",
              "image": "pizza1.png",
              "price": 0.0038,
              "description": "A garden of delight"
            },
            {
              "id": 2,
              "title": "Pepperoni",
              "image": "pizza2.png",
              "price": 0.0042,
              "description": "Spicy treat"
            },
            {
              "id": 3,
              "title": "Margarita",
              "image": "pizza3.png",
              "price": 0.0042,
              "description": "Essential classic"
            },
            {
              "id": 4,
              "title": "Crusty",
              "image": "pizza4.png",
              "price": 0.0028,
              "description": "A dry mouthed favorite"
            },
            {
              "id": 5,
              "title": "Charred Leopard",
              "image": "pizza5.png",
              "price": 0.0099,
              "description": "For those with a darker side"
            }
          ];

        await route.fulfill({ json: menu_response });
    });
}

export async function mockFranchiseGet( currentPage ) {
    /** @type {import('@playwright/test').Page} */
    let page = currentPage;

    await page.route('*/**/api/franchise', async ( route ) => {
        expect( route.request().method() ).toBe( 'GET' );
        const franchiseResponse = [
            {
              "id": 1,
              "name": "pizzaPocket",
              "stores": [
                {
                  "id": 1,
                  "name": "SLC"
                }
              ]
            },
            {
              "id": 2,
              "name": "Test Franchise",
              "stores": [
                {
                    "id": 2,
                    "name": "Test Store"
                }
              ]
            }
          ];

        await route.fulfill({ json: franchiseResponse })
    } );
}

