const transactionsUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")
const h3 = document.querySelector("#moneyTransfers")
const eye = document.querySelector('.eye')
const iptEye = document.querySelector('#eye')


const localStorageTransactions = JSON.parse(localStorage
  .getItem('transactions'))

let transactions = 
localStorage.getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
  transactions = transactions.filter(transaction => 
    transaction.id !== ID)

  changeVisibility  
  updateLocalStorage()
  init()
}

const now = new Date()
const dayName = new Array ("Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado")
const monName = new Array ("Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 'Julho', "Agosto",'Setembro', "Outubro", "Novembro", "Dezembro")

const addTransactionIntoDOM = ({ amount, name, id, Day, Week, Month, Year, Hours}) => {
  const operator = amount < 0 ? "-" : "+"
  const CSSClass = amount < 0 ? "minus" : "plus"
  const amountWithoutOperator = Math.abs(amount)
  const milhar = amountWithoutOperator.toLocaleString('pt-BR', { currency: 'BRL', style: 'currency' })
  const li = document.createElement("li")
  li.classList.add(CSSClass)
  h3.innerHTML = `
  <h3>Transações</h3>
  `
  li.innerHTML = ` 
  <button class="delete-btn" onClick="removeTransaction(${id})">x</button> 
  <h4> ${name} </h4>
  <span>${operator} ${milhar}</span>
  <p> Transação feita no dia: ${Day}, ${Week}, do Mes de ${Month}.<br> Ano: ${Year}.<br> As: ${Hours}</p>
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
  if(eye.innerHTML = 'visibility_off'){
    balanceDisplay.textContent = `${total}`  
    eye.innerHTML = 'visibility'
  }
  }

const init = () => {
  transactionsUl.innerHTML = ''
  transactions.forEach(addTransactionIntoDOM)
  if (transactionsUl.innerHTML === ''){
    h3.innerHTML = ''
    
  }
  
  
  updateBalanceValues()
}

init()

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
  
}

const generateID = () => Math.round(Math.random() * 1000)

const addToTransactionsArray = (transactionName, transactionsAmount, day, week, month, year, hours) => {
  transactions.push({ 
    id: generateID(), 
    name: transactionName, 
    amount: Number(transactionsAmount),
    Day: day, 
    Week: week,
    Month: month,
    Year: year,
    Hours: hours
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

  const day = now.getDate()
  const week = dayName[now.getDay()]
  const month = monName[now.getMonth()]
  const year = now.getFullYear()
  const hours = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()

  if (isSomeInputEmpty){
    alert("Por favor, preencha tanto o nome quanto o valor da transação! ")
    return
  }
  
  addToTransactionsArray(transactionName, transactionsAmount, day, week, month, year, hours)
  init()
  updateLocalStorage()
  cleanInputs()
 
}

const changeVisibility = () => {
  const transactionsAmounts = transactions.map(({ amount }) => amount)
    const total = Number(getTotal(transactionsAmounts)).toLocaleString('pt-BR', {currency: 'BRL', style: 'currency'})


      if (eye.textContent === 'visibility') {
        eye.innerHTML = 'visibility_off'
        balanceDisplay.textContent = 'R$ ----'
      } else if(eye.innerHTML = 'visibility_off'){
        balanceDisplay.textContent = `${total}`  
        eye.innerHTML = 'visibility'
      }
}

form.addEventListener("submit", handleFormSubmit)

eye.innerHTML = 'visibility'
iptEye.addEventListener('change', changeVisibility)