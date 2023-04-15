const Jobsite = require('../../../../../models/jobsite')
const Equipment = require('../../../../../models/equipment')

export default async function (req, res, next) {
    const number = req.query.name.split(' ')[0]
    const name = req.query.name.split(' ')[1]
    const foundEquipment = await Equipment.findOne({ number: number, name: name })
    const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })

    if (!foundEquipment && !foundJobsite) throw new Error
    const index = foundJobsite.equipment.indexOf(`${foundEquipment.number} ${foundEquipment.name}`)

    try {
        if (index > -1) foundJobsite.equipment.splice(index, 1)

        await foundJobsite.save()
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }
}