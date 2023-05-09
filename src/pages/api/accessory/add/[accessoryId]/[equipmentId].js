const Equipment = require('../../../../../models/equipment')
const Accessory = require('../../../../../models/accessory')
const Jobsite = require('../../../../../models/jobsite')

export default async function addAccessory (req, res, next) {

    try {
        const foundEquipment = await Equipment.findById(req.query.equipmentId)
        const foundAccessory = await Accessory.findById(req.query.accessoryId)
        const foundJobsite = await Jobsite.findOne({ "equipment._id": foundEquipment._id })
        const existingAccessory = await foundEquipment.accessories.find((e) => e._id.toString() === foundAccessory._id.toString())
        const occupiedEquipment = await Equipment.findOne({ "accessories._id": foundAccessory._id })

        if (!foundEquipment || !foundAccessory) {
            res.status(401).json( { message: 'Equipment or accessory not found' } )
            return
        }
        if (existingAccessory !== undefined){
            res.status(401).json( { message: `${foundAccessory.name} being used in this equipment` } )
            return
        }
        if (occupiedEquipment) {
            res.status(401).json( { message: `${foundAccessory.name} being used on ${occupiedEquipment.number} ${occupiedEquipment.name}` } )
            return
        }
        if (!foundJobsite) {
            res.status(401).json( { message: `First assign ${foundEquipment.number} ${foundEquipment.name} a jobsite` } )
        }

        // DELETE EQUIPMENT BEFORE UPDATING IT
        const index = foundJobsite.equipment.findIndex((e) => e._id.toString() === foundEquipment._id.toString())
        if (index > -1) foundJobsite.equipment.splice(index, 1)

        //PUSH ACCESSORY INTO EQUIPMENT AND ADD EQUIPMENT TO JOBSITE
        await foundEquipment.accessories.push(foundAccessory);
        await foundJobsite.equipment.push(foundEquipment);

        await foundJobsite.save()
        await foundEquipment.save()
        res.json(foundEquipment)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Error' })
    }


}