const Jobsite = require('../../../../models/jobsite')
const Accessory = require('../../../../models/accessory')

export default async function deleteAccessory (req, res, next) {
    const foundAccessory = await Accessory.findOne({ _id: req.query.accessoryId })
    const foundJobsite = await Jobsite.findOne({ "accessories._id": foundAccessory._id })

    await Accessory.findOneAndDelete({ _id: foundAccessory._id })
    
    if (!foundAccessory && !foundJobsite) throw new Error
    
    try {
        if (foundJobsite) {
            const index = foundJobsite.accessories.findIndex((e) => e._id.equals(foundAccessory._id))
            if (index > -1) foundJobsite.accessories.splice(index, 1)
            await foundJobsite.save()
    
            await Accessory.findByIdAndDelete(foundAccessory._id)
            res.json(foundJobsite)
        } else {
            await Accessory.findByIdAndDelete(foundAccessory._id)
            res.json(foundJobsite)
        }
    } catch (error) {
        next(error)
    }
}