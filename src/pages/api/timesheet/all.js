const Timesheet = require('../../../models/timesheet')

export default async function (req, res, next) {
    await Timesheet.find({})
        .then(timesheets => res.json(timesheets))
        .catch(next)
}