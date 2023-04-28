const Accessory = require('../../../models/accessory')

export default async function postAccessory (req, res, next) {
    await Accessory.create(req.body)
        .then(accessory => res.json(accessory))
        .catch(next)
}