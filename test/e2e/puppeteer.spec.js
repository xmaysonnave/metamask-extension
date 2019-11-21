import assert from 'assert'
import {
  // assertElementNotPresent,
  // checkBrowserForConsoleErrors,
  // closeAllWindowHandlesExcept,
  // findElement,
  // findElements,
  // loadExtension,
  // openNewPage,
  // switchToWindowWithTitle,
  // verboseReportOnFailure,
  // waitUntilXWindowHandles,
  // setupFetchMocking,
  prepareExtensionForTesting,
} from './helpers'

import firstTimeFlow from './lib/features/first-time-flow'
import accountInfo from './lib/features/account-info'
import { logout, login } from './lib/features/logout-login'
import addAccount from './lib/features/add-account'
import importSeedPhrase from './lib/features/import-seed'
import balanceChecker from './lib/features/balance-checker'
import send from './lib/features/send'
import { transactionList, transactionDetail } from './lib/features/transaction-list'

describe('Puppeteer', function () {
  this.timeout(0)
  this.bail(true)

  let browser, page

  const testSeedPhrase = 'phrase upgrade clock rough situate wedding elder clever doctor stamp excess tent'
  const password = 'correct horse battery staple'

  before(async () => {
    const result = await prepareExtensionForTesting({ responsive: true })
    browser = result.browser
    const pages = await browser.pages()
    page = pages[0]
    // await setupFetchMocking(driver)
  })

  afterEach(async function () {
    // TODO: checkBrowserForConsoleErrors find alternative to driver.manage().logs()
    // https://github.com/GoogleChrome/puppeteer/blob/v1.20.0/docs/api.md#class-consolemessage
  })

  // after(async () => {
  //   await browser.close()
  // })

  describe('First time flow', () => {

    it('runs the through the first time flow', async () => {
      await firstTimeFlow(page, 'create', password)
    })

  })

  describe('Show account information', () => {
    it('shows the QR code for the account', async () => {
      await accountInfo(page)
    })
  })

  describe('Log Out and Log In', () => {
    it('logout', async () => {
      await logout(page)
    })

    it('login', async () => {
      await login(page, password)
    })
  })

  describe('Account', () => {
    it('adds account and changes account name', async () => {
      const newAccountName = '2nd account'
      const accountName = await addAccount(page, newAccountName)
      assert.equal(accountName, newAccountName)
    })
  })

  describe('Import Seed Phrase', () => {
    it('', async () => {
      await importSeedPhrase(page, testSeedPhrase)
    })

    it('balanceChecker', async () => {
      const expectedBalance = '100 ETH'
      const selector = '.balance-display .token-amount'
      await balanceChecker(page, expectedBalance, selector)
    })
  })

  describe('Send', () => {
    it('send', async () => {
      await send(page)
    })

    it('', async () => {
      const txList = await transactionList(page)
      assert(txList.length, 1)
    })

    it('', async () => {
      assert.equal(await transactionDetail(page, 'amount'), '-1 ETH')
    })

    it('send with fast', async () => {
      await send(page, 'Fast')
    })

    it('', async () => {
      const txList = await transactionList(page)
      assert(txList.length, 2)
    })

    it('send with advanced', async () => {
      await send(page, 'Advanced')
    })

    it('', async () => {
      const txList = await transactionList(page)
      assert(txList.length, 3)
    })
  })

  describe('Send from dapp', () => {
    it('', () => {

    })
  })

})
