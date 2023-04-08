const Jobsite = require('../../../../../models/jobsite')
const User = require('../../../../../models/user')

export default async function (req, res, next) {
    const foundUser = await User.findOne({ _id: req.query.userId })
    const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })
    const existingUser = foundJobsite.employees.find(name => name === foundUser.name)
    if (!foundUser && !foundJobsite) throw new Error('User or Jobsite not found')
    if (existingUser != undefined) throw new Error('User already in Jobsite')
    
    try {
        foundJobsite.employees.push(foundUser.name);
        await foundJobsite.save()
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }
}