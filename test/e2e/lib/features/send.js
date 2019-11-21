import assert from 'assert'

// export default async function send (page, gasOption) {
export default async function send (page, opts = {}) {
  let contactName
  await page.waitFor('.account-and-transaction-details')

  const send = `//button[contains(text(), 'Send')]`
  const sendButton = await page.$x(send)
  await sendButton[0].click()

  const sendTo = '.ens-input.send__to-row'
  await page.waitFor(sendTo)


  if (opts.addressBook === true) {

    await page.waitFor('.send__select-recipient-wrapper__group-item__title')
    const contact = `.send__select-recipient-wrapper__group-item__content`
    const name = await page.evaluate(el => el.innerText, contact)
    assert.equal(name, contactName)

    await page.click('.send__select-recipient-wrapper__group-item')

  } else {

    await page.type(sendTo, opts.address)

  }

  await page.waitFor('.send-v2__form')
  const input = '.unit-input__input'

  if (opts.addToaddressBook === true) {

    contactName = 'Test Name 1'

    await page.waitFor('.send__dialog.dialog--message')
    await page.click('.send__dialog.dialog--message')

    await page.waitFor('.add-to-address-book-modal')

    await page.type('.add-to-address-book-modal__input', contactName)

    const save = `//button[contains(text(), 'Save')]`
    const saveButton = await page.$x(save)
    saveButton[0].click()

    await page.waitFor('.ens-input__selected-input__subtitle')

    const ensTitle = await page.$('.ens-input__selected-input__title')
    const name = await page.evaluate(el => el.innerText, ensTitle)

    assert.equal(name, contactName, 'Send Screen Address Contact Save')

  }

  switch (opts.gasOption) {
    case undefined:
      const amount = '1000'
      await page.type(input, amount)

      const error = await page.$('.send-v2__error-amount')
      const errorAmount = await page.evaluate(el => el.innerText, error)

      assert.equal(errorAmount, 'Insufficient funds.', 'Send screen should render an insufficient fund error message')

      const inputValue = await page.$eval(input, el => el.value)
      for (const char of inputValue) { // eslint-disable-line
        await page.keyboard.press('Backspace')
      }

      await page.click('.send-v2__amount-max')
      const isDisabled = await page.$('input[disabled]') !== null
      assert(isDisabled)
      assert(Number(await page.$eval(input, el => el.value)) > 99)

      await page.click('.send-v2__amount-max')
      const isEnabled = await page.$('input[disabled]') === null
      assert(isEnabled)
      break

    case 'Advanced':
      await page.click('.advanced-gas-options-btn')
      await page.waitFor('.gas-modal-page-container')
      const save = `//button[contains(text(), 'Save')]`
      const saveButton = await page.$x(save)
      await saveButton[0].click()
      await page.waitFor(500)
      break

    case 'Slow':
    case 'Average':
    case 'Fast':
      const gas = `//button/div/div[contains(text(), '${opts.gasOption}')]`
      const gasTab = await page.$x(gas)
      await gasTab[0].click()
      break

    default:
      throw new Error(`Select gas options 'Slow', 'Average', 'Fast', or 'Advanced'`)
  }

  await page.type(input, '1')

  const next = `//button[contains(text(), 'Next')]`
  const nextButton = await page.$x(next)
  await nextButton[0].click()

  await page.waitFor('.confirm-page-container-content')
  const confirm = `//button[contains(text(), 'Confirm')]`
  const confirmButton = await page.$x(confirm)
  await confirmButton[0].click()

}
