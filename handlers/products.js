const {db} = require('../util/admin')



exports.getAllProducts = (req, res) => {
    
    db
        .collection('products')
        .orderBy('productName')
        .get()
        .then(data => {
            let products = []
            data.forEach (doc => {
                products.push({
                    productId: doc.id,
                    productName: doc.data().productName,
                    price: doc.data().price,
                    created: doc.data().created,
                })
            })
            return res.json(products)
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({error: err.code})
        })
}


exports.addNewProduct = (req, res) => {

    const newProduct = {
        productName: req.body.productName,
        price: req.body.price,
        created: new Date().toISOString()
    }

    db
        .collection('products')
        .add(newProduct)
        .then(doc => {
            res.json({message: `Product ${doc.id} created`})
        })
        .catch(err => {
            res.status(500).json({error: 'Error happened in adding product'})
            console.error(err)
        })
}

exports.updateProduct = (req, res) => {
    const newProduct = {
        productName: req.body.productName,
        price: req.body.price,
        created: new Date().toISOString()
    }

    let oldUProductDocId = req.body.oldProductDocId

    // console.log('oldUProductDocId', oldUProductDocId)

    db
        .collection('products')
        .add(newProduct)
        .then(doc => {
            db.collection('products').doc(oldUProductDocId)
            .delete()
            .then(() => {
                res.json({message: `Product ${doc.id} created and product ${oldUProductDocId} deleted`})})
            .catch(err => {
                res.status(500).json({error: 'Error happened in updating or deleting product'})
                console.error(err)
            })
        })
        .catch(err => {
            res.status(500).json({error: 'Error happened in adding product'})
            console.error(err)
        })
}



exports.deleteProduct = (req, res) => {

    productIdToBeDeleted = req.body.productId

    db
        .collection('products')
        .doc(productIdToBeDeleted)
        .delete()
        .then(() => {
            res.json({message: `Product ${productIdToBeDeleted} deleted`})
        })
        .catch(err => {
            res.status(500).json({error: 'Error happened in deleting Product'})
            console.error(err)
        })
}
