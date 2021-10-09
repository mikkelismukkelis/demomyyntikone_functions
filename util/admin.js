const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

// admin.initializeApp()
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'DATABASEURL',
})

const db = admin.firestore()

module.exports = { admin, db }
