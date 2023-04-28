const Daily = require('../../../models/daily')

export default async function allDailies (req, res, next) {
    await Daily.find({})
    .then(daily => res.json(daily))
    .catch(next)
}