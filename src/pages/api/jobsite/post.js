const Jobsite = require('../../../models/jobsite')

export default async function (req, res, next) {
    await Jobsite.create(req.body)
        .then(job => res.json(job))
        .catch(next)
}