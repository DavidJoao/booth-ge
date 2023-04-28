const User = require('../../../../../models/user')

export default async function removeUserAdmin (req, res, next) {
    const foundUser = await User.findOne({ _id: req.query.userId })

    try {
        foundUser.isAdmin = false
        await foundUser.save()
        res.json(foundUser)
    } catch (error) {
        next(error)
    }
}