const Jobsite = require('../../../../models/jobsite')

export default async function (req, res, next) {
    await Jobsite.findOneAndDelete({ _id: req.query.jobsiteId })
    .then(jobsite => res.json(jobsite))
    .catch(next)
}