const Jobsite = require('../../../models/jobsite')

export default async function findAllJobsites (req, res, next){
    await Jobsite.find({})
        .then(jobsites => res.json(jobsites))
        .catch(next)
}

