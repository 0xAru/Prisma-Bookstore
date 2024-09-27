const bookRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authGuard = require("../services/authGuard")

const prisma = new PrismaClient()

bookRouter.get("/addbook", authGuard, async (req, res) => {
    res.render("pages/addbook.html.twig", {
        title: "Ajouter un livre - Bookstore",
        user: await prisma.user.findUnique({
            where:{
                id:req.session.user.id
            }
        })
    })
})

bookRouter.post("/addbook", authGuard, async (req, res) => {
    try {
        const book = await prisma.book.create({
            data: {
                author: req.body.author,
                title: req.body.title,
                userId: req.session.user.id
            }
        })
        res.redirect("/dashboard")
    } catch (error) {
        res.render("pages/addbook.html.twig", {
            title: "Ajouter un livre - Bookstore",
            user: req.session.user,
            error: error
        })
    }
})

bookRouter.get("/updateBook/:bookId", authGuard, async (req,res) => {
    try {
        const book = await prisma.book.findUnique({
            where: {
                id: parseInt(req.params.bookId)
            }
        })
        res.render("pages/addbook.html.twig", {
            title: "Modifier un livre - Bookstore",
            user: await prisma.user.findUnique({
                where: {
                    id: req.session.user.id
                }
            }),
            book
        })
    } catch (error) {
        res.render("pages/addbook.html.twig", {
            title: "Modifier un livre - Bookstore",
            user: await prisma.user.findUnique({
                where: {
                    id: req.session.user.id
                }
            }),
            error
        })
    }
})

bookRouter.post("/updateBook/:bookId", authGuard, async (req, res) => {
    try {
        const updateBook = await prisma.book.update({
            where: {
                id: parseInt(req.params.bookId),
            },
            data: {
                title: req.body.title,
                author: req.body.author
            }
        })
        res.redirect("/dashboard")
    } catch (error) {
        res.render("pages/addbook.html.twig", {
            title: "Modifier un livre - Bookstore",
            user: await prisma.user.findUnique({
                where: {
                    id: req.session.user.id
                }
            }),
            book: await prisma.book.findUnique({
                where: {
                    id: parseInt(req.params.bookId)
                }
            }),
            error
        })
    }
})

bookRouter.post("/deleteBook/:bookId", authGuard, async (req, res) => {
    console.log("Tentative de suppression du livre avec ID :", req.params.bookId); // Log pour vérifier l'ID
    try {
        const deleteBook = await prisma.book.delete({
            where: {
                id: parseInt(req.params.bookId)
            }
        });
        console.log("Livre supprimé :", deleteBook); // Log pour confirmer la suppression
        res.redirect("/dashboard");
    } catch (error) {
        console.error("Erreur lors de la suppression :", error); // Log pour les erreurs
        res.redirect("/");
    }
});

module.exports = bookRouter;