const Jobsite = require('../../../../../models/jobsite')
const User = require('../../../../../models/user')

export default async function (req, res, next) {
    
    try {

        const foundUser = await User.findOne({ _id: req.query.userId })
        const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })
        const existingUser = await foundJobsite.employees.find(name => name === foundUser.name)
        const occupiedJob = await Jobsite.findOne({ employees: foundUser.name })

        if (!foundUser && !foundJobsite) {
            res.status(401).json( {message: 'User or Jobsite not found'})
            return
        }
        if (existingUser !== undefined) {
            res.status(401).json( {message:`${foundUser.name} already this jobsite`})
            return
        }
        if (occupiedJob) {
            res.status(401).json( {message:`${foundUser.name} already in ${occupiedJob.name}`})
            return
        }
        
        foundJobsite.employees.push(foundUser.name);
        await foundJobsite.save()
        res.json(foundJobsite)
    } catch {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }
}