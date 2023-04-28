const Equipment = require('../../../models/equipment')

export default async function postEquipment (req, res, next) {
    await Equipment.create(req.body)
        .then(equipment => res.json(equipment))
        .catch(next)
}