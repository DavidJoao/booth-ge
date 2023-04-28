
const Equipment = require('../../../models/equipment')

export default async function allEquipment(req, res, next) {
    await Equipment.find({})
    .then(equipment => res.json(equipment))
    .catch(next)
}