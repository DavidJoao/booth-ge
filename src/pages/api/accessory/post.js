const Accessory = require('../../../models/accessory')

export default async function (req, res, next) {
    await Accessory.create(req.body)
        .then(accessory => res.json(accessory))
        .catch(next)
}