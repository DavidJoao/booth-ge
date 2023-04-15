const Jobsite = require('../../../../../models/jobsite')
const User = require('../../../../../models/user')

export default async function (req, res, next) {
    
    try {

        const foundUser = await User.findOne({ _id: req.query.userId })
        const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })
        const existingUser = await foundJobsite.employees.find(_id => _id === foundUser._id)
        const occupiedJob = await Jobsite.findOne({ "employees._id": foundUser._id })

        if (!foundUser && !foundJobsite) {
            res.status(401).json( {message: 'User or Jobsite not found'})
            return
        }
        if (existingUser !== undefined) {
            res.status(401).json( {message:`${foundUser.name} already at this jobsite`})
            return
        }
        if (occupiedJob) {
            res.status(401).json( {message:`${foundUser.name} already at ${occupiedJob.name}`})
            return
        }
        
        foundJobsite.employees.push(foundUser);
        await foundJobsite.save()
        res.json(foundJobsite)
    } catch {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }
}