const Jobsite = require('../../../../models/jobsite');
const Equipment = require('../../../../models/equipment');

export default async function editEquipment (req, res, next) {

    try {
        const foundEquipment = await Equipment.findOne({ _id: req.query.equipmentId })
        const foundJobsite = await Jobsite.findOne({ "equipment._id": foundEquipment._id })
    
        if (foundJobsite !== null) {
            res.status(401).json({ message: `Remove equipment from ${foundJobsite.name} before editing` })
        } else {
            Object.assign(foundEquipment, req.body)
            await foundEquipment.save()
    
            res.json(foundEquipment)
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }


}