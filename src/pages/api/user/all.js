const User = require('../../../models/user')

export default async function allUsers (req, res, next) {
    await User.find({})
        .then(users => res.send(users))
        .catch(next)
}