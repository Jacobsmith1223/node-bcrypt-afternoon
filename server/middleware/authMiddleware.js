usersOnly = (req,res,next) => {
    if(!req.session.user) {
        return res.status(401).send('INTRUDER ALERT')
    }
    next()
}

adminsOnly = (req,res,next) => {
    if(!req.session.user.isAdmin) {
        return res.status(403).send('You suck again')
    }
}


module.exports = {
    userOnly,
    adminsOnly
}