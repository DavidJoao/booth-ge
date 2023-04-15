
const Equipment = require('../../../models/equipment')

export default async function (req, res, next) {
    await Equipment.find({})
    .then(equipment => res.json(equipment))
    .catch(next)
}