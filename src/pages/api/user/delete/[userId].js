const User = require('../../../../models/user')
const Jobsite = require('../../../../models/jobsite')


export default async function deleteUser (req, res, next) {
    try {
        const foundUser = await User.findOne({ _id: req.query.userId })
        const foundJobsite = await Jobsite.findOne({ "employees.name": foundUser.name })
        if (foundJobsite) {
            const index = foundJobsite.employees.findIndex( (e) => e._id.toString() === foundUser._id.toString())
            if (index > -1) foundJobsite.employees.splice(index, 1)
            await foundJobsite.save()
            User.findOneAndDelete({ _id: req.query.userId})
        } else {
            const deletedUser = await User.findOneAndDelete({ _id: req.query.userId})
            res.json(deletedUser)
        }
    } catch (err) {
        console.error(err)
        res.status(500).send('Server Error')
    }
}