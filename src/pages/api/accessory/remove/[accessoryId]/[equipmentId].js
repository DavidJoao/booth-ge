const Jobsite = require('../../../../../models/jobsite')
const Equipment = require('../../../../../models/equipment')
const Accessory = require('../../../../../models/accessory')

export default async function removeAccessory (req, res, next) {
    const foundEquipment = await Equipment.findById(req.query.equipmentId)
    const foundAccessory = await Accessory.findById(req.query.accessoryId)
    const foundJobsite = await Jobsite.findOne({ "equipment._id": foundEquipment._id })

    if (!foundEquipment && !foundJobsite) throw new Error
    const accessoryIndex = foundEquipment.accessories.findIndex((e) => e._id.equals(foundAccessory._id))
    const equipmentIndex = foundJobsite.equipment.findIndex((e) => e._id.equals(foundEquipment._id))

    // DELETE EQUIPMENT FROM JOBSITE
    
    
    
    try {
        if (equipmentIndex > -1) foundJobsite.equipment.splice(equipmentIndex, 1)
        if (accessoryIndex > -1) foundEquipment.accessories.splice(accessoryIndex, 1)
        
        await foundJobsite.equipment.push(foundEquipment);
        
        await foundEquipment.save()
        await foundJobsite.save()

        res.json(foundEquipment)
    } catch (error) {
        next(error)
    }
}