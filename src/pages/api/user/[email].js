const User = require('../../../models/user')

export default async function (req, res, next) {
    const { email } = req.query;

    const foundUser = User.findOne({ email: email })
    .then(user => {
        const { email, isAdmin, name } = user
        res.json({ email, isAdmin, name })
    })
    .catch(next)

    console.log(`${foundUser.name} found!`) 

}