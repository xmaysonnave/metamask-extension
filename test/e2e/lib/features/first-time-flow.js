export default async function firstTimeFlow (page, path, password) {

  // Welcome Screen
  await page.waitFor('.welcome-page__header')
  await page.click('.first-time-flow__button')

  switch (path) {

    case 'create':

      // Create Wallet Path
      const createWalletXPath = `//button[contains(text(), 'Create a Wallet')]`
      await page.waitForXPath(createWalletXPath)
      const createWalletButton = await page.$x(createWalletXPath)
      await createWalletButton[0].click()

      // MetaMetrics
      await page.waitFor('.metametrics-opt-in')
      await page.click('button.btn-default.btn--large.page-container__footer-button')

      // Create New Account Password
      const createPassword = `//div[contains(text(), 'Create Password')]`
      await page.waitForXPath(createPassword)

      await page.type('.first-time-flow__form #create-password', password)
      await page.type('.first-time-flow__form #confirm-password', password)

      await page.click('.first-time-flow__checkbox') // TOS Checkbox
      await page.click('.first-time-flow__form button')

      // Reveal Seed Phrase
      const seedPhraseBlocker = '.reveal-seed-phrase__secret-blocker'
      await page.waitFor(seedPhraseBlocker)
      await page.click(seedPhraseBlocker)

      const seedPhrase = await page.evaluate(() => document.querySelector('.reveal-seed-phrase__secret').innerText)
      const nextScreen = 'button.btn-primary.first-time-flow__button'
      await page.click(nextScreen)

      // Confirm Seed Phrase
      const confirmSeedPhrase = `//div[contains(text(), 'Confirm your Secret Backup Phrase')]`
      await page.waitForXPath(confirmSeedPhrase)

      const words = seedPhrase.split(' ')
      for (const word of words) {
        await clickWord(page, word)
      }
      break

    case 'import':

      // Import Account Path
      const importWalletXPath = `//button[contains(text(), 'Import Wallet')]`
      await page.waitForXPath(importWalletXPath)
      const importWalletButton = await page.$x(importWalletXPath)
      await importWalletButton[0].click()

      // MetaMetrics
      await page.waitFor('.metametrics-opt-in')
      await page.click('button.btn-default.btn--large.page-container__footer-button')

      // Import Account Details
      const importAccount = `//div[contains(text(), 'Import an Account with Seed Phrase')]`
      await page.waitForXPath(importAccount)

      const testSeedPhrase = 'forum vessel pink push lonely enact gentle tail admit parrot grunt dress'
      await page.type('textarea.first-time-flow__textarea', testSeedPhrase)

      await page.type('.first-time-flow__form #password', password)
      await page.type('.first-time-flow__form #confirm-password', password)

      await page.click('.first-time-flow__checkbox') // TOS Checkbox
      await page.click('.first-time-flow__form button')
      break

    default:
      throw new Error(`Select either 'import' or 'create' path for first time flow`)
  }


  await page.click('button.first-time-flow__button')

  // Success Screen
  await page.waitForXPath(`//div[contains(text(), 'Congratulations')]`)
  await page.click('button.first-time-flow__button')
}

async function clickWord (page, word) {
  const xpath = `//div[contains(@class, 'confirm-seed-phrase__seed-word--shuffled') and not(contains(@class, 'confirm-seed-phrase__seed-word--selected')) and contains(text(), '${word}')]`

  const wordButton = await page.$x(xpath)
  await wordButton[0].click('button.first-time-flow__button')
}
