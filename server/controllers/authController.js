const bcrypt = require('bcryptjs')

const register = async (req,res) => {
    const {username, password, isAdmin} = req.body;
    const db = req.app.get('db')
    const existingUser = await db.get_user([username])
    if(existingUser[0]){return res.status(409).send('Username taken, SUCKAH')}
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    const registeredUser = await db.register_user([isAdmin,username,hash])
    const user = registeredUser
    req.session.user = {
        isAdmin: user.is_admin,
        username: user.username,
        id:user.id
    }
    res.status(200).send(req.session.user)



}
const login = async (req,res) => {
    const {username,password} = req.body
    const db = req.app.get('db')
    const foundUser = await db.get_user([username])
    const user = foundUser[0]
    if(!user) return res.status(401).send('user not found, suckah. register as a new user before logging in ')
    const isAuthenticated = bcrypt.compareSync(password,user.hash)
    if(!isAuthenticated){
        res.status(403).send('incorrect user or password, SUCKAH')
    }
    req.session.user = {isAdmin: user.is_admin, id: isSecureContext.id, username: isSecureContext.username}
    return res.send(req.session.user)

}

const logout = (req,res) => {
    req.session.destroy();
    return res.sendStatus(200)
}

module.exports = {
    register,
    login,
    logout
}