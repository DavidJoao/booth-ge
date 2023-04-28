const Timesheet = require('../../../models/timesheet')

export default async function allTimesheets (req, res, next) {
    await Timesheet.find({})
        .then(timesheets => res.json(timesheets))
        .catch(next)
}