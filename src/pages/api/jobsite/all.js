const Jobsite = require('../../../models/jobsite')

export default async function(req, res, next){
    Jobsite.find({})
        .then(jobsites => res.json(jobsites))
        .catch(next)
}

