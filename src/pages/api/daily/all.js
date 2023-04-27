const Daily = require('../../../models/daily')

export default async function (req, res, next) {
    await Daily.find({})
    .then(daily => res.json(daily))
    .catch(next)
}