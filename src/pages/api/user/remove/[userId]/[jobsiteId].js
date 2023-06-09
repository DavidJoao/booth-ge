const Jobsite = require('../../../../../models/jobsite')
const User = require('../../../../../models/user')

export default async function removeUserFromJobsite (req, res, next) {
    const foundUser = await User.findOne({ _id: req.query.userId })
    const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })

    if (!foundUser && !foundJobsite) throw new Error
    const index = foundJobsite.employees.findIndex((e) => e._id.toString() === (foundUser._id.toString()))

    try {
        if (index > -1) foundJobsite.employees.splice(index, 1)

        await foundJobsite.save()
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }
}   