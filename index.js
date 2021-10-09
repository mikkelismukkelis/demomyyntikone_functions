const functions = require('firebase-functions')

const cors = require('cors')

const express = require('express')
const app = express()

app.use(cors())

// const fbAuth = require('./util/fbAuth')

const {
  getAllProducts,
  addNewProduct,
  updateProduct,
  deleteProduct,
} = require('./handlers/products')
const { createLoginUser, login } = require('./handlers/loginUsers')
const {
  addNewUser,
  addNewUsersMass,
  updateUser,
  deleteUser,
  getAllNames,
  getAllNamesWithPin,
  getFullNames,
  getFirstNames,
  getLastNames,
  checkPin,
} = require('./handlers/users')
const { addNewPurchase } = require('./handlers/purchase')
const {
  getMonthlyReport,
  getMonthlyReportSplitMonth,
} = require('./handlers/reports')

// GET ALL PRODUCTS
app.get('/products', getAllProducts)

// POST NEW PRODUCT
// app.post('/admin/product', fbAuth, addNewProduct)
app.post('/admin/product', addNewProduct)

// UPDATE PRODUCT
// app.post('/admin/updateproduct', fbAuth, updateProduct)
app.post('/admin/updateproduct', updateProduct)

// DELETE PRODUCT
// app.post('/admin/deleteproduct', fbAuth, deleteProduct)
app.post('/admin/deleteproduct', deleteProduct)

// POST NEW USER
// app.post('/admin/user', fbAuth, addNewUser)
app.post('/admin/user', addNewUser)

// POST MASS USERS
// app.post('/admin/user', fbAuth, addNewUsersMass)
app.post('/admin/usersmass', addNewUsersMass)

// UPDATE USER
// app.post('/admin/updateuser', fbAuth, updateUser)
app.post('/admin/updateuser', updateUser)

// DELETE USER
// app.post('/admin/deleteuser', fbAuth, deleteUser)
app.post('/admin/deleteuser', deleteUser)

// CREATE NEW AUTHENTICATIONUSER
app.post('/signup', createLoginUser)

// LOGIN USER
app.post('/login', login)

// CREATE NEW PURCHASE
app.post('/purchase', addNewPurchase)

// REPORT
app.get('/admin/monthlyreport', getMonthlyReport)

// REPORT - HALF MONTH
app.get('/admin/monthlyreportsplitmonth', getMonthlyReportSplitMonth)

// GET ALL NAMES, FULL, FIRST AND LAST
app.get('/allnames', getAllNames)

// GET ALL NAMES, FULL, FIRST AND LAST AND PIN CODE
app.get('/allnameswithpin', getAllNamesWithPin)

// GET ALL FULL NAMES
app.get('/fullnames', getFullNames)

// GET ALL FIRSTNAMES
app.get('/firstnames', getFirstNames)

// GET ALLLASTNAMES
app.get('/lastnames', getLastNames)

// CHECK PIN
app.get('/checkpin', checkPin)

exports.api = functions.region('europe-west2').https.onRequest(app)
