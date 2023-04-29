const User = require('../../models/user')
const bcrypt = require('bcrypt')

export default async function register (req, res, next) {
    try {
        const { password, email, name, isAdmin, isForeman } = req.body;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    
        let foundEmail = await User.findOne({ email: email})

        if (password.split('').length < 8) {
            res.status(401).json({ error: 'Password must contain minimun 8 characters' })
            return
        }
        
        if (emailRegex.test(email) === false) {
            res.status(401).json({ error: 'Invalid Email: Please enter a valid email address' })
            return
        }
    
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
            return
        }

    } catch {

    }
  }