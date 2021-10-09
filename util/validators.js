const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return email.match(emailRegEx) ? true : false
}

const isEmpty = (string) => {
    return string.trim() === '' ? true : false
}

const isEmptyArray = (array) => {
    return (Array.isArray(array) && array.length) ? false : true
}


exports.validateSignupData  = (data) => {
    
    let errors = {}

    if(isEmpty(data.email)) {
        errors.email = 'Must not be empty'
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be valid email address'
    }

    if(isEmpty(data.password)) errors.password = 'Must not be empty'
    if(data.password !== data.confirmPassword ) errors.confirmPassword = 'Passwords must match'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}


exports.validateLoginData = (data) => {
    
    let errors = {}

    if(isEmpty(data.email)) errors.email = 'Must not be empty'
    if(isEmpty(data.password)) errors.password = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.validateNewUserData = (data) => {
    
    let errors = {}

    if(isEmpty(data.firstName)) errors.firstName = 'Must not be empty'
    if(isEmpty(data.lastName)) errors.lastName = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}


exports.validatePurchaseData = (data) => {
    
    let errors = {}

    if(isEmpty(data.firstName)) errors.firstName = 'Must not be empty'
    if(isEmpty(data.lastName)) errors.lastName = 'Must not be empty'
    if(isEmptyArray(data.purchases)) errors.purchases = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}