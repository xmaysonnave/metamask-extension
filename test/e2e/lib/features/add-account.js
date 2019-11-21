export default async function addAccount (page, accountName) {
  // Click Account Menu Icon
  await page.click('.account-menu__icon')
  await page.waitFor('.menu.account-menu')

  // Click Create Account Button
  const createAccount = `//div[contains(text(), 'Create Account')]`
  const createAccountButton = await page.$x(createAccount)
  await createAccountButton[0].click()

  // Set Account Name
  await page.waitFor('.new-account')
  await page.type('.new-account-create-form input', accountName)

  // Create
  const create = `//button[contains(text(), 'Create')]`
  const createButton = await page.$x(create)
  await createButton[0].click()

  await page.waitFor('.account-details__account-name')
  return await page.evaluate(() => document.querySelector('.account-details__account-name').innerText)
}
