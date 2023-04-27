const Daily = require('../../../models/daily')

export default async function (req, res, next) {
    await Daily.create(req.body)
        .then(daily => res.json(daily))
        .catch(next)
}