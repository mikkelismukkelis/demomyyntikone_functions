const {db} = require('../util/admin')

const { validatePurchaseData } = require('../util/validators')

const createDocId = (userId, date) => {
    return `${userId}_${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}_${("0" + date.getHours()).slice(-2)}${("0" + date.getMinutes()).slice(-2)}${("0" + date.getSeconds()).slice(-2)}`
}

exports.addNewPurchase = (req, res) => {

    let purchases = req.body.purchases
    // console.log('p: ', purchases)

    let date = new Date()

    let newPurchase = {
        fullName: req.body.firstName + ' ' + req.body.lastName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userId:  req.body.firstName.toLowerCase() + req.body.lastName.toLowerCase(),
        created: date.toISOString(),
        createdYear: date.getFullYear(),
        createdMonth: date.getMonth()+1,
        createdDay: date.getDate(),
        purchases: req.body.purchases
    }

    const {valid, errors} = validatePurchaseData(newPurchase)

    if(!valid) return res.status(400).json(errors)

        db
            .collection('purchases')
            .doc(createDocId(newPurchase.userId, date))
            .set(newPurchase)
            .then(doc => {
                res.json({message: `Purchase succesfully created`})
                // console.log("Document " + doc.id + " successfully written!")
            })
            .catch(err => {
                res.status(500).json({error: 'Error happened in adding purchase'})
                console.error(err)

            })


}
