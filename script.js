const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")


const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction => 
    transaction.id !== ID)

  updateLocalStorage()
  init()
}

const addTransactionIntoDOM = ({ amount, name, id}) => {
  const operator = amount < 0 ? "-" : "+"
  const CSSClass = amount < 0 ? "minus" : "plus"
  const amountWithoutOperator = Math.abs(amount)
  const milhar = amountWithoutOperator.toLocaleString('de-DE', { currency: 'BRL', style: 'currency' })
  const li = document.createElement("li")

  li.classList.add(CSSClass)
  li.innerHTML = `
      ${name} 
      <span>${operator} ${milhar} </span>
      <button class="delete-btn" onClick="removeTransaction(${id})">x</button> 
      `
  transactionsUl.append(li)

}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)

const getTotal = transactionsAmounts => transactionsAmounts
.reduce((accumulator, transaction) => accumulator + transaction, 0)

const updateBalanceValues = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount)
  const total = Number(getTotal(transactionsAmounts)).toLocaleString('pt-BR', {currency: 'BRL', style: 'currency'})
  const income = Number(getIncome(transactionsAmounts)).toLocaleString('pt-BR', {currency: 'BRL', style: 'currency'})
  const expense = Number(getExpenses(transactionsAmounts)).toLocaleString('pt-BR', {currency: 'BRL', style: 'currency'})

  balanceDisplay.textContent = `${total}`  
  incomeDisplay.textContent = `${income}`  
  expenseDisplay.textContent = `${expense}`  

  }

const init = () => {
  transactionsUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues()
}

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionsAmount) => {
  transactions.push({ 
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionsAmount) 
  })
}

const cleanInputs = () => {
  inputTransactionName.value = ''
  inputTransactionAmount.value = ''
}

const handleFormSubmit = event => {
  event.preventDefault() 


  const transactionName = inputTransactionName.value.trim()
  const transactionsAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionsAmount === '' || transactionName === ''

  if (isSomeInputEmpty){
    alert("Por favor, preencha tanto o nome quanto o valor da transação! ")
    return
  }

  addToTransactionsArray(transactionName, transactionsAmount)
  init()
  updateLocalStorage()
  cleanInputs()
 
}

form.addEventListener("submit", handleFormSubmit)
