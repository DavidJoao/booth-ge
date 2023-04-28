const Daily = require('../../../models/daily')

export default async function postDaily (req, res, next) {
    await Daily.create(req.body)
        .then(daily => res.json(daily))
        .catch(next)
}