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



const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImVyaWthIiwiaWQiOiI2N2MwNjExNDEwZTdhZTI4NjEwOGQ3NTQiLCJpYXQiOjE3NDA2Nzc3MzMsImV4cCI6MTc0MDY4MTMzM30.rcVbQMnnyix_IeFDdQrwfiL5HvpeeJ_myrC5OxRGTxg";

test.describe("When logged in", () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("http://localhost:5173");

    await page.evaluate((token) => {
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({ token, username: "erika" })
      );
    }, TOKEN);

    await page.reload();
  });

  test("a new blog can be created", async ({ page }) => {
    test.setTimeout(60000);

    await page.click('button:has-text("Create new blog")');

    await page.waitForSelector('input[name="title"]');
    await page.waitForSelector('input[name="author"]');
    await page.waitForSelector('input[name="url"]');
    await page.waitForSelector('input[name="likes"]');

    await page.fill('input[name="title"]', "Nuevo Blog");
    await page.fill('input[name="author"]', "erika");
    await page.fill('input[name="url"]', "https://blog.com");
    await page.fill('input[name="likes"]', "10");
    await page.click('button[type="submit"]');
  });

  test('user can delete a blog', async ({ page }) => {
 
    test.setTimeout(60000);
  
    await page.goto('http://localhost:5173');
    await page.evaluate((token) => {
      localStorage.setItem('loggedUser', JSON.stringify({ token, username: 'erika' }));
    }, TOKEN);
    await page.reload();

    await page.click('button:has-text("Create new blog")');
    await page.fill('input[name="title"]', 'Blog to Delete');
    await page.fill('input[name="author"]', 'erika');
    await page.fill('input[name="url"]', 'https://example.com');
    await page.fill('input[name="likes"]', '10');
    await page.click('button[type="submit"]');

    await page.waitForSelector('div.blog-summary');
  
    await page.click('button:has-text("View")');
  
    await page.waitForSelector('div.blog-details');

    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('Are you sure you want to delete this blog?');
      await dialog.accept();  
    });
  
    await page.click('button:has-text("Delete")');

    await expect(page.locator('div.blog-summary')).not.toContainText('Blog to Delete');
  });

  
});