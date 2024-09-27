const userRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension");
const bcrypt = require("bcrypt")
const authGuard = require("../services/authGuard")

//Si on veux ajouter d'autres extentions on utilise le 'chaînage' en rajoutant .$extends(...) autant de fois que necessaire
const prisma = new PrismaClient().$extends(hashPasswordExtension)


userRouter.get("/", (req, res) => {
    res.render('pages/home.html.twig', {
        title: "Homepage"
    })
})

userRouter.get("/subscribe", (req, res) => {
    res.render('pages/subscribe.html.twig', {
        title: "Inscription - Bookstore"
    })
})

userRouter.post("/subscribe", async (req, res) => {
    try {
        if (req.body.password === req.body.confirmPassword) {
            const user = await prisma.user.create({
                data: {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                }
            })
            res.redirect("/login")

        } else throw ({ confirmPassword: "Vos mots de passe ne correspondent pas" })
        res.render("pages/subscribe.html.twig")

    } catch (error) {
        res.render('pages/subscribe.html.twig', {
            error: error,
            title: "Inscription - Bookstore"
        })
    }
})

userRouter.get("/login", (req, res) => {
    res.render('pages/login.html.twig',
        {
            title: "Connexion - Bookstore"
        })
})

userRouter.post("/login", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        })

        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user
                res.redirect("/dashboard")
            } else {
                throw { password: "Mot de passe incorrect" }
            }
        } else {
            throw { email: "Email incorrect" }
        }

    } catch (error) {
        res.render("pages/login.html.twig", {
            error: error,
            title: "Connexion - Bookstore"
        })
    }
})

userRouter.get("/dashboard", authGuard, async (req, res) => {
    res.render('pages/dashboard.html.twig', {
        user: await prisma.user.findUnique({
            where: {
                email: req.session.user.email
            },
            include: {
                books:true
            }
        }),
        title: "Tableau de bord - Bookstore"
    })
})

userRouter.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
})

module.exports = userRouter;