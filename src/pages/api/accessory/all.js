const Accessory = require('../../../models/accessory')

export default async function allAccessories (req, res, next) {
    await Accessory.find({})
        .then(accessories => res.json(accessories))
        .catch(next)
}