const Jobsite = require('../../../../../models/jobsite')
const User = require('../../../../../models/user')

export default async function (req, res, next) {
    const foundUser = await User.findOne({ _id: req.query.userId })
    const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })
    if (!foundUser && !foundJobsite) throw new Error('User or Jobsite not found')
    
    try {
        foundJobsite.employees.push(foundUser.name);
        await foundJobsite.save()
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }
}