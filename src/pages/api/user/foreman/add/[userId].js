const User = require('../../../../../models/user')

export default async function (req, res, next) {
    const foundUser = await User.findOne({ _id: req.query.userId })

    try {
        foundUser.isForeman = true
        await foundUser.save()
        res.json(foundUser)
    } catch (error) {
        next(error)
    }
}