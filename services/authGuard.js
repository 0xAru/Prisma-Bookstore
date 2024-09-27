const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const authGuard = async (req, res, next) => {
    try {
        if (req.session.user) {
            let user = await prisma.user.findUnique({
                where: {
                    email: req.session.user.email
                }
            })
            if (user) {
                return next()
            }
            throw { authGuard: "Utilisateur non connecté" }
        }
        throw { authGuard: "Utilisateur non connecté" }
    } catch (error) {
        res.redirect("/login")
    }
}

module.exports = authGuard;