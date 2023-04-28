const Notification = require('../../../models/notification')

export default async function postNotification(req, res, next) {
    await Notification.create(req.body)
        .then(notification => res.json(notification))
        .catch(next)
}