const Jobsite = require('../../../../models/jobsite')
const User = require('../../../../models/user')

export default async function editUser (req, res, next) {
    try {
        const foundUser = await User.findOne({ _id: req.query.userId })
        const foundJobsite = await Jobsite.findOne({ 'employees._id': req.query.userId })
    
        if (foundJobsite) {
            res.status(401).json( {message: `Remove ${foundUser.name} from ${foundJobsite.name} before updating info`})
            return
        }

        Object.assign(foundUser, req.body);
        await foundUser.save();

        res.status(200).json({ message: 'User updated successfully' });
        
    } catch (err) {
        next(err)
    }

}