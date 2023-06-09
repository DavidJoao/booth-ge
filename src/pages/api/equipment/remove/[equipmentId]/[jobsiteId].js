const Jobsite = require('../../../../../models/jobsite')
const Equipment = require('../../../../../models/equipment')

export default async function removeEquipment(req, res, next) {
    const foundEquipment = await Equipment.findOne({ _id: req.query.equipmentId })
    const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })

    if (!foundEquipment && !foundJobsite) throw new Error
    const index = foundJobsite.equipment.findIndex((e) => e._id.toString() === (foundEquipment._id.toString()))

    try {
        if (index > -1) foundJobsite.equipment.splice(index, 1)

        await foundJobsite.save()
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }
}