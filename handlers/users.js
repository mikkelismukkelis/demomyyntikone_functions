const { db } = require('../util/admin')
const _ = require('lodash')

const { validateNewUserData } = require('../util/validators')

exports.addNewUser = (req, res) => {
  const newUser = {
    fullName: req.body.firstName + ' ' + req.body.lastName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userId: req.body.firstName.toLowerCase() + req.body.lastName.toLowerCase(),
    pinCode: req.body.pinCode,
    created: new Date().toISOString()
  }

  const { valid, errors } = validateNewUserData(newUser)

  if (!valid) return res.status(400).json(errors)

  db.collection('users')
    .doc(newUser.userId)
    .set(newUser)
    .then(() => {
      res.json({ message: `User ${newUser.userId} created` })
    })
    .catch(err => {
      res.status(500).json({ error: 'Error happened in adding user' })
      console.error(err)
    })
}

// FOR MASS ADDING USERS
exports.addNewUsersMass = (req, res) => {
  const users = req.body

  let newUser = {}

  users.map(user => {
    newUser = {
      fullName: user.firstName + ' ' + user.lastName,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.firstName.toLowerCase() + user.lastName.toLowerCase(),
      pinCode: user.pinCode,
      created: new Date().toISOString()
    }

    const { valid, errors } = validateNewUserData(newUser)

    if (!valid) return res.status(400).json(errors)
    console.log('Lets create user with ID ', newUser.userId)
    db.collection('users')
      .doc(newUser.userId)
      .set(newUser)
      .then(() => {
        console.log('User creation ok')
        // Promise.resolve()
      })
      .catch(err => {
        res.status(500).json({ error: 'Error happened in adding users' })
        console.error(err)
      })
  })

  res.status(200).json({ status: 'ok' })
}

exports.updateUser = (req, res) => {
  const newUser = {
    fullName: req.body.firstName + ' ' + req.body.lastName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userId: req.body.firstName.toLowerCase() + req.body.lastName.toLowerCase(),
    pinCode: req.body.pinCode,
    created: new Date().toISOString()
  }

  let oldUserDocId = req.body.oldUserDocId

  const { valid, errors } = validateNewUserData(newUser)

  if (!valid) return res.status(400).json(errors)

  db.collection('users')
    .doc(newUser.userId)
    .set(newUser)
    .then(() => {
      if (oldUserDocId === newUser.userId) {
        res.json({
          message: `User ${newUser.userId} PIN code changed`
        })
        return
      }
      db.collection('users')
        .doc(oldUserDocId)
        .delete()
        .then(() => {
          res.json({
            message: `User ${newUser.userId} created and user ${oldUserDocId} deleted`
          })
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: 'Error happened in updating or deleting user' })
          console.error(err)
        })
    })
    .catch(err => {
      res.status(500).json({ error: 'Error happened in adding user' })
      console.error(err)
    })
}

exports.deleteUser = (req, res) => {
  userIdToBeDeleted = req.body.userId

  db.collection('users')
    .doc(userIdToBeDeleted)
    .delete()
    .then(() => {
      res.json({ message: `User ${userIdToBeDeleted} deleted` })
    })
    .catch(err => {
      res.status(500).json({ error: 'Error happened in deleting user' })
      console.error(err)
    })
}

exports.getAllNames = (req, res) => {
  db.collection('users')
    .orderBy('fullName')
    .get()
    .then(data => {
      let allNames = []
      data.forEach(doc => {
        allNames.push({
          fullName: doc.data().fullName,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName
        })
      })
      let distinctNames = _.uniq(allNames)
      return res.json(distinctNames)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.getAllNamesWithPin = (req, res) => {
  db.collection('users')
    .orderBy('fullName')
    .get()
    .then(data => {
      let allNames = []
      data.forEach(doc => {
        allNames.push({
          fullName: doc.data().fullName,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          pinCode: doc.data().pinCode
        })
      })
      // let distinctNames = _.uniq(allNames)
      return res.json(allNames)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.getFullNames = (req, res) => {
  db.collection('users')
    .orderBy('fullName')
    .get()
    .then(data => {
      let allNames = []
      data.forEach(doc => {
        allNames.push(doc.data().fullName)
      })
      let distinctNames = _.uniq(allNames)
      return res.send(distinctNames)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.getFirstNames = (req, res) => {
  db.collection('users')
    .orderBy('firstName')
    .get()
    .then(data => {
      let allFirstNames = []
      data.forEach(doc => {
        allFirstNames.push(doc.data().firstName)
      })
      let distinctFirstNames = _.uniq(allFirstNames)
      return res.send(distinctFirstNames)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.getLastNames = (req, res) => {
  db.collection('users')
    .orderBy('lastName')
    .get()
    .then(data => {
      let allLastNames = []
      data.forEach(doc => {
        allLastNames.push(doc.data().lastName)
      })
      let distinctLastNames = _.uniq(allLastNames)
      return res.send(distinctLastNames)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.checkPin = (req, res) => {
  let pinCode = req.query.pincode

  db.collection('users')
    .where('pinCode', '==', pinCode)
    .get()
    .then(data => {
      if (data.empty) {
        console.log('No user with queried pin code')
        res.status(203).json({ message: 'No user found with given pin' })
        return
      }

      let allNames = []
      data.forEach(doc => {
        allNames.push({
          fullName: doc.data().fullName,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName
        })
      })

      return res.json(allNames)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}
