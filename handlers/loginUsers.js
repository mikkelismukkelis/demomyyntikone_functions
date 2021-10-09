const {db} = require('../util/admin')

const fbConfig = require('../util/fbConfig')

const firebase = require('firebase')
firebase.initializeApp(fbConfig)

const { validateSignupData, validateLoginData } = require('../util/validators')

exports.createLoginUser = (req, res) => {
    const newAuthUser = {

        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    }

    const {valid, errors} = validateSignupData(newAuthUser)

    if(!valid) return res.status(400).json(errors)

    let token, userId
    firebase
        .auth()
        .createUserWithEmailAndPassword(newAuthUser.email, newAuthUser.password)
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            userCredentials = {
                email: newAuthUser.email,
                created: new Date().toISOString(),
                userId
            }
            return db.doc(`/authUsers/${userId}`).set(userCredentials)
        })
        .then(() => {
            return res.status(201).json({token})
        })
        .catch(err => {
            console.error(err)
            if (err.code === 'auth/email-already-in-use') {
                return res.status(400).json({email: 'Email is already in use'})
            } else {
                return res.status(500).json({error: err.code})
            }
            
        })
}


exports.login = (req, res) => {
    const loginUser = {
        email: req.body.email,
        password: req.body.password
    }

    const {valid, errors} = validateLoginData(loginUser)

    if(!valid) return res.status(400).json(errors)

    firebase
        .auth()
        .signInWithEmailAndPassword(loginUser.email, loginUser.password)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.json({token})
        })
        .catch(err => {
            console.error(err)
            if(err.code === 'auth/wrong-password') {
                return res.status(403).json({general: 'Wrong credentials, please try again'})
            } else return res.status(500).json({error: err.code})

        })

}