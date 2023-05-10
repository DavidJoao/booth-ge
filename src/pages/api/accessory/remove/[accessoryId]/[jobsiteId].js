const Jobsite = require('../../../../../models/jobsite')
const Accessory = require('../../../../../models/accessory')

export default async function removeAccessory(req, res, next) {
    const foundAccessory = await Accessory.findOne({ _id: req.query.accessoryId })
    const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })

    if (!foundAccessory && !foundJobsite) throw new Error
    const index = foundJobsite.accessories.findIndex((e) => e._id.toString() === (foundAccessory._id.toString()))

    try {
        if (index > -1) foundJobsite.accessories.splice(index, 1)

        await foundJobsite.save()
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }
}