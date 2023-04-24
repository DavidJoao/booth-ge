const Timesheet = require('../../../../models/timesheet')

export default async function (req, res, next) {
    await Timesheet.deleteOne({ _id: req.query.timesheetId })
        .then(timesheet => res.json(timesheet))
        .catch(next)
}