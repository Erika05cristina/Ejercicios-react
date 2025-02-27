const { test, expect, beforeEach, describe } = require("@playwright/test");

// describe('Blog app', () => {
//   beforeEach(async ({ page }) => {
//     await page.goto('http://localhost:5173')
//   })

//   test('Login form is shown', async ({ page }) => {
//     await expect(page.locator('form')).toBeVisible({ timeout: 10000 });

//   })
// })

// test.describe('Blog app', () => {

//   // Registramos un usuario antes de cada test
//   // test.beforeEach(async ({ page, request }) => {
//   //   await request.post('http://localhost:3003/api/users/register', {
//   //     data: { username: 'erika', password: 'erika', name: "erika" }
//   //   });
//   // });

//   test('Login form is visible', async ({ page }) => {
//     await page.goto('http://localhost:5173');
//     await page.waitForSelector('form', { timeout: 15000 });
//     await expect(page.locator('form')).toBeVisible();
//   });

//   test.describe('Login functionality', () => {

//     test('succeeds with correct credentials', async ({ page }) => {
//       test.setTimeout(60000);
//       await page.goto('http://localhost:5173');
//       await page.fill('input[name="username"]', 'erika');
//       await page.fill('input[name="password"]', 'erika');
//       await page.click('button[type="submit"]');
//       await page.waitForSelector('h2', { timeout: 15000 });
//       await expect(page.locator('h2')).toHaveText('blogs');
//     });

//     test('fails with wrong credentials', async ({ page }) => {
//       await page.goto('http://localhost:5173');
//       await page.fill('input[name="username"]', 'fail');
//       await page.fill('input[name="password"]', 'fail');
//       await page.click('button[type="submit"]');

//     });
//   });
// });

describe("When logged in", () => {
  let token;
  beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("http://localhost:5173");

    await page.fill('input[name="username"]', "erika");
    await page.fill('input[name="password"]', "erika");
    await page.click('button[type="submit"]');


    token = await page.evaluate(() => {
      return localStorage.getItem('token'); 
    });

    console.log("Token:", token);  
  });

  test("a new blog can be created", async ({ page }) => {
    test.setTimeout(60000);
  
    await page.fill('input[name="username"]', "erika");
    await page.fill('input[name="password"]', "erika");
    await page.click('button[type="submit"]');
  
    await page.waitForTimeout(2000);
  
    const token = await page.evaluate(() => localStorage.getItem('loggedUser') ? JSON.parse(localStorage.getItem('loggedUser')).token : null);
  
    console.log("Token:", token);  
  
    if (!token) {
      throw new Error("Token no encontrado");
    }
   
    await page.goto("http://localhost:5173", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  
    await page.fill('input[name="title"]', "Nuevo Blog");
    await page.fill('input[name="author"]', "Nuevo Autor");
    await page.fill('input[name="url"]', "https://blog.com");
    await page.fill('input[name="likes"]', "10");
    await page.click('button[type="submit"]');
  
    await expect(page.locator("div.blog")).toContainText("Nuevo Blog");
  });
}
);  