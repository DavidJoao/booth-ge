const Jobsite = require('../../../models/equipment')

export default async function (req, res, next) {
    await Jobsite.create(req.body)
        .then(equipment => res.json(equipment))
        .catch(next)
}