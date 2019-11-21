module.exports = {
  transactionList,
  transactionDetail,
}

async function transactionList (page) {

  await page.waitFor('.account-and-transaction-details')
  const transationList = await page.$$('.transaction-list-item')
  return transationList
  
}

async function transactionDetail (page, detail, txNumber = 0) {

  await page.waitFor('.account-and-transaction-details')

  let txDetail, txDetailValue

  switch (detail) {

    case 'action':
    case 'status':
      txDetail = `.transaction-list-item__${detail}`
      txDetailValue = await page.$$eval(txDetail, _ => _.map(el => el.innerText))
      return txDetailValue[txNumber]

    case 'nonce':
    case 'amount':
      txDetail = `.transaction-list-item__${detail}`
      txDetailValue = await page.$$eval(txDetail, _ => _.map(el => el.title))
      return txDetailValue[txNumber]

    default:
      throw new Error(`Select a transaction detail`)
  }

}
