const Notification = require('../../../../models/notification')

export default async function editJobsite (req, res, next) {
    try {
        const foundNotification = await Notification.findOne({ _id: req.query.notificationId })
    
        Object.assign(foundNotification, req.body)
        await foundNotification.save()
    
        res.json(foundNotification)
    } catch (error) {
        res.json(error)
    }

}