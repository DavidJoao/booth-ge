const Daily = require('../../../../models/daily')

export default async function allDailies (req, res, next) {
    await Daily.find({}).sort({ $natural: -1 }).limit(req.query.limit)
    .then(daily => res.json(daily))
    .catch(next)
}