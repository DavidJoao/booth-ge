const Notification = require('../../../models/notification')

export default async function (req, res, next) {
    await Notification.find({})
        .then(notifications => res.json(notifications))
        .catch(next)
}