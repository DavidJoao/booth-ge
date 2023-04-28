const Notification = require('../../../../models/notification')

export default async function deleteNotification (req, res, next) {
    await Notification.findOneAndDelete({ _id: req.query.notificationId })
    .then(notification => res.json(notification))
    .catch(next)
}