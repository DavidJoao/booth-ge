const Timesheet = require('../../../../models/timesheet')

export default async function allTimesheets (req, res, next) {
    await Timesheet.find({}).sort({ $natural: -1 }).limit(req.query.limit)
        .then(timesheets => res.json(timesheets))
        .catch(next)
}