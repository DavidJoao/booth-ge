const Jobsite = require('../../../../models/jobsite');
const Accessory = require('../../../../models/accessory');

export default async function editAccessory (req, res, next) {

    try {
        const foundAccessory = await Accessory.findOne({ _id: req.query.accessoryId })
        const foundJobsite = await Jobsite.findOne({ "accessories._id": foundAccessory._id })
    
        if (foundJobsite !== null) {
            res.status(401).json({ message: `Remove accessory from ${foundJobsite.name} before editing` })
            throw new Error
        } else {
            Object.assign(foundAccessory, req.body)
            await foundAccessory.save()
    
            res.json(foundAccessory)
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }
} 