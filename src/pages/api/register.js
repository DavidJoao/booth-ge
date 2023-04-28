const User = require('../../models/user')
const bcrypt = require('bcrypt')

export default async function register (req, res, next) {
    const { password, email, name, isAdmin, isForeman } = req.body;

    let foundEmail = await User.findOne({ email: email})

    if(!foundEmail){
        await bcrypt.hash(password, 10)
        .then(hash => ({
            email: email,
            password: hash,
            isAdmin: isAdmin,
            isForeman: isForeman,
            name: name
        }))
        .then(user => User.create(user))
        .then(user => res.status(201).json(user))
        .catch(next)
    } else {
        res.status(400).json({ error: 'Email already in use!' })
    }
  }