const Jobsite = require('../../../../models/jobsite')

export default async function editJobsite (req, res, next) {
    try {
        const foundJobsite = await Jobsite.findOne({ _id: req.query.jobsiteId })
    
        Object.assign(foundJobsite, req.body)
        await foundJobsite.save()
    
        res.json(foundJobsite)
    } catch (error) {
        next(error)
    }

}