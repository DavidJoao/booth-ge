const Jobsite = require('../../../../models/jobsite')
const Equipment = require('../../../../models/equipment')

export default async function deleteEquipment (req, res, next) {
    const foundEquipment = await Equipment.findOne({ _id: req.query.equipmentId })
    const foundJobsite = await Jobsite.findOne({ "equipment._id": foundEquipment._id })

    await Equipment.findOneAndDelete({ _id: foundEquipment._id })
    
    if (!foundEquipment && !foundJobsite) throw new Error
    const index = foundJobsite.equipment.findIndex((e) => e._id.equals(foundEquipment._id))

    try {
        if (index > -1) foundJobsite.equipment.splice(index, 1)
        await foundJobsite.save()

        await Equipment.findByIdAndDelete(foundEquipment._id)
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }
}