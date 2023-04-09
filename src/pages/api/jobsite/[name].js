const User = require('../../../models/user')
const Jobsite = require('../../../models/jobsite')

export default async function (req, res, next) {
    const foundJobsite = await Jobsite.find({ employees: req.query.name })
    res.json(foundJobsite)
}