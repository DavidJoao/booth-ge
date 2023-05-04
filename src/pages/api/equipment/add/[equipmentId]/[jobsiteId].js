const Jobsite = require('../../../../../models/jobsite')
const Equipment = require('../../../../../models/equipment')

export default async function addEquipment(req, res, next) {
    
    try {

        const foundEquipment = await Equipment.findOne({ _id: req.query.equipmentId })
        const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })
        const existingEquipment = await foundJobsite.equipment.find(_id => _id.toString() === foundEquipment._id.toString())
        const occupiedJob = await Jobsite.findOne({ "equipment._id": foundEquipment._id })

        if (!foundEquipment && !foundJobsite) {
            res.status(401).json( {message: 'Equipment not found'})
            return
        }
        if (existingEquipment !== undefined) {
            res.status(401).json( {message:`${foundEquipment.number} ${foundEquipment.name} already at this jobsite`})
            return
        }
        if (occupiedJob) {
            res.status(401).json( {message:`${foundEquipment.number} ${foundEquipment.name} already at ${occupiedJob.name}`})
            return
        }
        
        foundJobsite.equipment.push(foundEquipment);
        await foundJobsite.save()
        res.json(foundJobsite)
    } catch {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }
}