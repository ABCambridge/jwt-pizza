import { expect } from 'playwright-test-coverage';

const testUserName = "TestUser";
const testEmail = "test@jwt.com";
const testPassword = "TestPassword";
const testFranchiseName = "TestFranchiseName";
const testStoreName = "TestStoreName";

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
      let responseBody;  
      if( route.request().method() == 'GET' ) {
          responseBody = [
            {
              "id": 1,
              "name": testFranchiseName,
              "stores": [
                {
                  "id": 1,
                  "name": testStoreName
                }
              ]
            }
          ];
        }
        else if ( route.request().method() == 'POST' ) {
          const requestBody = {
            "stores": [],
            "name": testFranchiseName,
            "admins": [
              {
                "email": testEmail
              }
            ]
          }
          expect( route.request().postDataJSON() ).toMatchObject( requestBody );
          responseBody = {}
        }
        await route.fulfill({ json: responseBody })
    } );

    await page.route( '*/**/api/franchise/1', async ( route ) => {
      if ( route.request().method() == 'GET' ) {
        const responseBody = [
          {
            "id": 1,
            "name": testFranchiseName,
            "admins": [
              {
                "id": 1,
                "name": testUserName,
                "email": testEmail
              }
            ],
            "stores": [
              {
                "id": 1,
                "name": testStoreName,
                "email": testEmail
              }
            ]
          }
        ];
        await route.fulfill({ json: responseBody });
      }
    } );

    await page.route( '*/**/api/franchise/1/store', async ( route ) => {
      if ( route.request().method() == 'POST' ) {
        const requestBody = {
          "id": "",
          "name": testStoreName
        }
        expect( route.request().postDataJSON() ).toMatchObject( requestBody );
        const responseBody = {
            "id": 1,
            "franchiseId": 1,
            "name": testStoreName
        }

        await route.fulfill({ json: responseBody });
      }
    });
}

async function mockOrderVerificationAPICall( currentPage ) {
  /** @type {import('@playwright/test').Page} */
  let page = currentPage;
  await page.route( '*/**/api/order/verify', async ( route ) => {
    if( route.request().method() == 'POST' ) {
      const responseBody = {
        "message": "valid",
        "payload": {
          "vendor": {
            "id": "acambrid",
            "name": "Andrew Cambridge"
          },
          "diner": {
            "id": 1,
            "name": testUserName,
            "email": testEmail
          },
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
            "id": 169
          }
        }
      }
      await route.fulfill({ json: responseBody });
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
        let responseBody;
        if( route.request().method() == 'POST') {
          const requestBody = {
            "name": testUserName,
            "email": testEmail,
            "password": testPassword
          };
          expect( route.request().postDataJSON() ).toMatchObject( requestBody );
          responseBody = {
            "user": {
              "name": testUserName,
              "email": testEmail,
              "roles": [
                {
                  "role": "diner"
                }
              ],
              "id": 1
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYnk1dXJqaTNoYyIsImVtYWlsIjoicmFuZEBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjkyLCJpYXQiOjE3Mzk0MDc2MTd9.4vTJOS-7eQaF4anv6Uu-7qqMv-jyI_AQlYH-sAeghgE"
          };
        }
        else if( route.request().method() == 'PUT' ) {
          const requestBody = {
            "email": testEmail,
            "password": testPassword
          };
          expect( route.request().postDataJSON() ).toMatchObject( requestBody );
          responseBody = {
            "user": {
              "id": 1,
              "name": testUserName,
              "email": testEmail,
              "roles": [
                {
                  "role": "admin"
                },
                {
                  "objectId": 76,
                  "role": "franchisee"
                }
              ]
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9LHsib2JqZWN0SWQiOjc2LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjc3LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjc4LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjc5LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjgwLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjgyLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjg0LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjg1LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjg2LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjg3LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjkwLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjkxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjkyLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjkzLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjk0LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjk1LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjk2LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjk3LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjk4LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjk5LCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjEwMCwicm9sZSI6ImZyYW5jaGlzZWUifSx7Im9iamVjdElkIjoxMDEsInJvbGUiOiJmcmFuY2hpc2VlIn0seyJvYmplY3RJZCI6MTAyLCJyb2xlIjoiZnJhbmNoaXNlZSJ9LHsib2JqZWN0SWQiOjEwMywicm9sZSI6ImZyYW5jaGlzZWUifSx7Im9iamVjdElkIjoxMDQsInJvbGUiOiJmcmFuY2hpc2VlIn1dLCJpYXQiOjE3Mzk0MDk1MzF9.n2mNP6_1taZCume1XqH_KoBePFXY8DV4oPXhgUtO5nI"
          }
        }
        else if ( route.request().method() == 'DELETE' ) {
          responseBody = {
            "message": "logout successful"
          }
        }
        await route.fulfill({ json: responseBody });
    });
}

export {
  testUserName,
  testEmail,
  testPassword,
  testFranchiseName,
  testStoreName,
  mockMenuGet,
  mockFranchiseAPICall,
  mockOrderAPICall,
  mockAuthAPICall,
  mockOrderVerificationAPICall
};