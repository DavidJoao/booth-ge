const User = require('../../../models/user')

export default async function findUserByEmail (req, res, next) {
    const { email } = req.query;

    const foundUser = User.findOne({ email: email })
    .then(user => {
        const { email, isAdmin, isModerator, name, isForeman, _id } = user
        res.json({ email, isAdmin, isModerator, name, isForeman, _id })
    })
    .catch(next)

    console.log(`${foundUser.name} found!`) 

}