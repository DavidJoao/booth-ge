const Jobsite = require('../../../../models/jobsite')

export default async function (req, res, next) {
    const occupiedJobsite = await Jobsite.find({employees: req.query.user})
    if (occupiedJobsite.length > 0) throw new Error()
}