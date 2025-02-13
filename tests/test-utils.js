import { expect } from 'playwright-test-coverage';

const testUserName = "TestUser";
const testEmail = "test@jwt.com";
const testPassword = "TestPassword";

async function mockMenuGet( currentPage ) {
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

async function mockFranchiseAPICall( currentPage ) {
    /** @type {import('@playwright/test').Page} */
    let page = currentPage;

    await page.route('*/**/api/franchise', async ( route ) => {
        if( route.request().method() == 'GET' ) {
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
        }
    } );
}

async function mockOrderAPICall( currentPage ) {
    /** @type {import('@playwright/test').Page} */
    let page = currentPage;

    await page.route('*/**/api/order', async ( route ) => {
      if( route.request().method() == 'POST' ) {
        const orderRequest = {
          "items": [
            {
              "menuId": 2,
              "description": "Pepperoni",
              "price": 0.0042
            }
          ],
          "storeId": "1",
          "franchiseId": 1
        };

      expect( route.request().postDataJSON() ).toMatchObject( orderRequest );
      const orderResponse = {
          "order": {
            "items": [
              {
                "menuId": 2,
                "description": "Pepperoni",
                "price": 0.0042
              }
            ],
            "storeId": "1",
            "franchiseId": 1,
            "id": 158
          },
          "jwt": "eyJpYXQiOjE3MzkzODU0NTAsImV4cCI6MTczOTQ3MTg1MCwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6IjE0bk5YT21jaWt6emlWZWNIcWE1UmMzOENPM1BVSmJuT2MzazJJdEtDZlEifQ.eyJ2ZW5kb3IiOnsiaWQiOiJhY2FtYnJpZCIsIm5hbWUiOiJBbmRyZXcgQ2FtYnJpZGdlIn0sImRpbmVyIjp7ImlkIjo4MiwibmFtZSI6Im96ajI1cjRtaWoiLCJlbWFpbCI6InJhbmRAand0LmNvbSJ9LCJvcmRlciI6eyJpdGVtcyI6W3sibWVudUlkIjoyLCJkZXNjcmlwdGlvbiI6IlBlcHBlcm9uaSIsInByaWNlIjowLjAwNDJ9XSwic3RvcmVJZCI6IjEiLCJmcmFuY2hpc2VJZCI6MSwiaWQiOjE1OH19.qOo6H_fXv1fLM_lnP6uqjPqApmbooiy_NGxK7Fz8-UWSU5M4iYNW0ijb8KaEN2e3nF4Z1GvU1oi9pQFArF-QhLIAiZy5PZdfWG8dgpkwMlGx4D2inRy5ENCVcSQm7bFkDQABuVT2Bma-G7sAi9mOQhQaduhGE-MHvWKMeXHh62z9Neb6dQfZDsNNxJ4TxCfebJX3l-YjE0TpTZWMPquKmUNw6gcgILZPK816y19BniteQ7l6BmUgLXxc009foSM73Ghu8e5tjecNGK2rryjJ68dsDI_G_Sv-WiSTj6ORmgxMCytibcIqvsadKL-ZlFVAQQducyc-R8-xD2CA8IYMxuu5tSuQRbXnoe39-mhxlBdKguAszI3T113IcgDNDo5RodTVspqbF5O-hVrk5kMH-mmlI-LDZt_wKoSxXsodzaAbgO4VeliUeQ4Cmigm4X9iFktdQ24cdkiM_xZt0CR-9aNUHlwd_AUOU_uTWiWiyIvkZ5xtKQbCML10U40dPdD_0a1bqrqH_D0bzcv9QSfOnOvbIoB46qVA8W0fco2d3fa_PvXy_kiDh1E2hN69TznnivsIXsDZxPCj6UXvCKY4ZZNfN0-_7olWVZpcBgkdcrVuvmF7aSuj_xO91Ag0swEdROFnVLDQwkysGBFrfP10tMRLM_oqIDTJiMlgnpRDVPQ"
        };

      await route.fulfill({ json: orderResponse });
      }
    } );
}

async function mockAuthAPICall( currentPage ) {
    /** @type {import('@playwright/test').Page} */
    let page = currentPage;

    await page.route('*/**/api/auth', async ( route ) => {
        if( route.request().method() == 'POST') {
          const requestBody = {
            "name": testUserName,
            "email": testEmail,
            "password": testPassword
          };
          expect( route.request().postDataJSON() ).toMatchObject( requestBody );
          const responseBody = {
            "user": {
              "name": testUserName,
              "email": testEmail,
              "roles": [
                {
                  "role": "diner"
                }
              ],
              "id": 3
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYnk1dXJqaTNoYyIsImVtYWlsIjoicmFuZEBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjkyLCJpYXQiOjE3Mzk0MDc2MTd9.4vTJOS-7eQaF4anv6Uu-7qqMv-jyI_AQlYH-sAeghgE"
          };
          await route.fulfill({ json: responseBody });
        }
    });
}

export {
  testUserName,
  testEmail,
  testPassword,
  mockMenuGet,
  mockFranchiseAPICall,
  mockOrderAPICall,
  mockAuthAPICall
};