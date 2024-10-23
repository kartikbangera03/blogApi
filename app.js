const mainRouter = require("./Router/mainRouter")
const protectedRouter = require("./Router/protectedRouter")
const express = require("express");
const PORT = process.env.PORT;
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const app = express();

app.use(express.urlencoded({ extended: false }));

app.use("/", mainRouter);

app.use("/blogAuthor" , protectedRouter)

app.listen(PORT, () => console.log("app listening on port 3000!"));