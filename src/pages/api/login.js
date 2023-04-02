const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

export default async function(req, res, next) {
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email: email })
        if (!foundUser) throw new Error();

        const match = await bcrypt.compareSync(password, foundUser.password);
        if (!match) throw new Error();

        const token = jwt.sign({ email }, process.env.NEXT_PUBLIC_KEY_SECRET, { expiresIn: '1h' })
        const userObject = {
            token: token,
            email: foundUser.email,
            name: foundUser.name,
            isAdmin: foundUser.isAdmin
        }

        res.json(userObject)

    } catch (error) {
        console.log(error)
    }
}