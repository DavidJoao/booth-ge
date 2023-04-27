const Daily = require('../../../../models/daily')

export default async function (req, res, next) {
    await Daily.deleteOne({ _id: req.query.dailyId })
        .then(daily => res.json(daily))
        .catch(next)
}