const Timesheet = require('../../../models/timesheet')

export default async function postTimesheet(req, res, next) {
    await Timesheet.create(req.body)
        .then(timesheet => res.json(timesheet))
        .catch(next)
}