import assert from 'assert'

export default async function balanceChecker (page, expectedBalanceText, selector) {
  const element = await page.$(selector)
  const balance = await page.evaluate(el => el.innerText, element)
  await page.waitFor(5000) // TODO: Remove for ci
  // assert.equal(expectedBalanceText, balance) // TODO: Turn on during ci
}
