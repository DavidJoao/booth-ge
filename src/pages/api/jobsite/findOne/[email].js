const Jobsite = require('../../../../models/jobsite')

export default async function (req, res, next) {
    try {
        const jobsites = await Jobsite.find({});
        const email = req.query.email;
    
        const jobsite = jobsites.find(j => j.employees.some(e => e.email === email));
    
        return res.json(jobsite);
      } catch (error) {
        return next(error);
      }
}