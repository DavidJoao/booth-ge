const Jobsite = require('../../../models/jobsite')

export default async function findJobsiteByName (req, res, next) {
    const foundJobsite = await Jobsite.find({ employees: req.query.name })
    res.json(foundJobsite)
}