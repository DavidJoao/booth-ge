const User = require('../../../../models/user')
const bcrypt = require('bcrypt')

export default async function (req, res, next) {
    try {
        const { password } = req.body;
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const foundUser = await User.findByIdAndUpdate(req.query.userId, { password: hashedPassword }, { new: true });
    
        res.json(foundUser);

    } catch (err) {
        console.log(err)
    }
}