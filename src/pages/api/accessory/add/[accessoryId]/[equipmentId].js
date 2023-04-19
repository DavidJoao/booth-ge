const Equipment = require('../../../../../models/equipment')
const Accessory = require('../../../../../models/accessory')

export default async function (req, res, next) {

    try {
        const foundEquipment = await Equipment.findById(req.query.equipmentId)
        const foundAccessory = await Accessory.findById(req.query.accessoryId)
        const existingAccessory = foundEquipment.accessories.find(accessory => accessory._id.equals(foundAccessory._id));
        const occupiedEquipment = await Equipment.findOne({ "accessories._id": foundAccessory._id })

        if (!foundEquipment || !foundAccessory) {
            res.status(401).json( { message: 'Equipment or accessory not found' } )
            return
        }
        if (existingAccessory !== undefined){
            res.status(401).json( { message: `${foundAccessory.name} in this equipment` } )
            return
        }
        if (occupiedEquipment) {
            res.status(401).json( { message: `${foundAccessory.name} being used in ${occupiedEquipment.number} ${occupiedEquipment.name}` } )
            return
        }

        foundEquipment.accessories.push(foundAccessory);
        foundEquipment.markModified('accessories')
        await foundEquipment.save()
        res.json(foundEquipment)
    } catch {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }


}