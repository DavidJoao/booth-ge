const Notification = require('../../../models/notification')

export default async function (req, res, next) {
    await Notification.create(req.body)
        .then(notification => res.json(notification))
        .catch(next)
}