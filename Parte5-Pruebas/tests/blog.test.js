const { test, expect, beforeEach, describe } = require('@playwright/test')

// describe('Blog app', () => {
//   beforeEach(async ({ page }) => {
//     await page.goto('http://localhost:5173')
//   })

//   test('Login form is shown', async ({ page }) => {
//     await expect(page.locator('form')).toBeVisible({ timeout: 10000 });

//   })
// })

 

test.describe('Blog app', () => {
  
  // Registramos un usuario antes de cada test
  // test.beforeEach(async ({ page, request }) => {  
  //   await request.post('http://localhost:3003/api/users/register', {
  //     data: { username: 'erika', password: 'erika', name: "erika" }
  //   });
  // });

  test('Login form is visible', async ({ page }) => {
    await page.goto('http://localhost:5173'); 
    await page.waitForSelector('form', { timeout: 15000 });
    await expect(page.locator('form')).toBeVisible();
  });

  test.describe('Login functionality', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      test.setTimeout(60000);  
      await page.goto('http://localhost:5173');
      await page.fill('input[name="username"]', 'erika');
      await page.fill('input[name="password"]', 'erika');
      await page.click('button[type="submit"]');
      await page.waitForSelector('h2', { timeout: 15000 });  
      await expect(page.locator('h2')).toHaveText('blogs');
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173');
      await page.fill('input[name="username"]', 'fail');
      await page.fill('input[name="password"]', 'fail');
      await page.click('button[type="submit"]');
    
    });
  });
});

