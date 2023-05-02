const User = require('../../../../../models/user')
const Jobsite = require('../../../../../models/jobsite')

export default async function addUserForeman (req, res, next) {
    const foundUser = await User.findOne({ _id: req.query.userId })
    const foundJobsite = await Jobsite.findOne({ "employees._id": foundUser._id })

    try {

        if (foundJobsite){
            res.status(401).json({ message: `Remove ${foundUser.name} from ${foundJobsite.name} before updating role` })
            return
        }

        foundUser.isForeman = true
        await foundUser.save()
        res.json(foundUser)

    } catch (error) {
        next(error)
    }
}