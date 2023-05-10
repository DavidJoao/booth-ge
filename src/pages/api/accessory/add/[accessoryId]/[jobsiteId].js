const Jobsite = require('../../../../../models/jobsite')
const Accessory = require('../../../../../models/accessory')

export default async function addAccessory (req, res, next) {
    
    try {

        const foundAccessory = await Accessory.findOne({ _id: req.query.accessoryId })
        const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })
        const existingAccessory = await foundJobsite.accessories.find(_id => _id.toString() === foundAccessory._id.toString())
        const occupiedJob = await Jobsite.findOne({ "accessories._id": foundAccessory._id })

        if (!foundAccessory && !foundJobsite) {
            res.status(401).json( {message: 'Accessory not found'})
            return
        }
        if (existingAccessory !== undefined) {
            res.status(401).json( {message:`${foundAccessory.name} already at this jobsite`})
            return
        }
        if (occupiedJob) {
            res.status(401).json( {message:`${foundAccessory.name} already at ${occupiedJob.name}`})
            return
        }
        
        foundJobsite.accessories.push(foundAccessory);
        await foundJobsite.save()
        res.json(foundJobsite)
    } catch {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }
}