const Jobsite = require('../../../../models/jobsite')
const Equipment = require('../../../../models/equipment')
const Accessory = require('../../../../models/accessory')

export default async function deleteAccessory (req, res, next) {
    const foundAccessory = await Accessory.findById(req.query.accessoryId)
    const foundEquipment = await Equipment.findOne({ "accessories._id": foundAccessory._id })

    let foundJobsite;
    if (foundEquipment) {
        foundJobsite = await Jobsite.findOne({ "equipment._id": foundEquipment._id })
    }

    
    // DELETE EQUIPMENT FROM JOBSITE
    
    
    try {
        if (foundJobsite && foundEquipment) {
            const accessoryIndex = foundEquipment.accessories.findIndex((e) => e._id.equals(foundAccessory._id))
            const equipmentIndex = foundJobsite.equipment.findIndex((e) => e._id.equals(foundEquipment._id))
            
            if (equipmentIndex > -1) foundJobsite.equipment.splice(equipmentIndex, 1)
            if (accessoryIndex > -1) foundEquipment.accessories.splice(accessoryIndex, 1)
            
            await foundJobsite.equipment.push(foundEquipment);
            
            await foundEquipment.save()
            await foundJobsite.save()
            await Accessory.findOneAndDelete({ _id: req.query.accessoryId })
        } else if (!foundJobsite && !foundEquipment) {
            await Accessory.findOneAndDelete({ _id: req.query.accessoryId })
        }


    } catch (error) {
        next(error)
    }
}