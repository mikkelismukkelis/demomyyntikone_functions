const { db } = require('../util/admin')

// const groupBy = (keys) => (array) =>
//   array.reduce((objectsByKeyValue, obj) => {
//     const value = keys.map((key) => obj[key]).join('-')
//     objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
//     return objectsByKeyValue
//   }, {})

exports.getMonthlyReport = (req, res) => {
  // console.log(req.query.createdYear)
  let createdYear = Number(req.query.createdYear)
  let createdMonth = Number(req.query.createdMonth)

  let purchasesRef = db.collection('purchases')

  let queryRef = purchasesRef
    .where('createdYear', '==', createdYear)
    .where('createdMonth', '==', createdMonth)

  queryRef
    .get()
    .then((snapshot) => {
      let monthlyPurchases = []
      if (snapshot.empty) {
        // console.log('No purchases found')
        res.json({ message: 'No purchase found' })
        return
      }
      snapshot.forEach((doc) => {
        monthlyPurchases.push({
          fullName: doc.data().fullName,
          created: doc.data().created,
          products: doc.data().purchases,
        })
      })
      // const groupByName = groupBy(['fullName']);
      // return res.json(groupByName(monthlyPurchases))
      return res.json(monthlyPurchases)
      // console.log(monthlyPurchases)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json({ error: err.code })
    })
}

exports.getMonthlyReportSplitMonth = async (req, res) => {
  let monthlyPurchases = []
  // let monthlyPurchasesLast = []
  // let monthlyPurchasesCurrent = []

  // console.log(req.query.createdYear)
  let createdYear = Number(req.query.createdYear)
  let createdMonth = Number(req.query.createdMonth)

  let lastCreatedYear =
    Number(req.query.createdMonth) === 1
      ? Number(req.query.createdYear) - 1
      : Number(req.query.createdYear)
  let lastCreatedMonth =
    Number(req.query.createdMonth) === 1
      ? 12
      : Number(req.query.createdMonth) - 1

  try {
    let purchasesRef = db.collection('purchases')

    let lastMonthSnapshot = await purchasesRef
      .where('createdYear', '==', lastCreatedYear)
      .where('createdMonth', '==', lastCreatedMonth)
      .where('createdDay', '>=', 15)
      .get()
    let currentMonthSnapshot = await purchasesRef
      .where('createdYear', '==', createdYear)
      .where('createdMonth', '==', createdMonth)
      .where('createdDay', '<=', 14)
      .get()

    if (lastMonthSnapshot.empty && currentMonthSnapshot.empty) {
      res.json({ message: 'No purchase found' })
      return
    }

    lastMonthSnapshot.forEach((doc) => {
      monthlyPurchases.push({
        fullName: doc.data().fullName,
        created: doc.data().created,
        products: doc.data().purchases,
      })
    })

    currentMonthSnapshot.forEach((doc) => {
      monthlyPurchases.push({
        fullName: doc.data().fullName,
        created: doc.data().created,
        products: doc.data().purchases,
      })
    })

    return res.json(monthlyPurchases)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}
