const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");


async function createBlogAuthor(){
    try {
        bcrypt.hash("steveCarell" , 10 , async(err , hashedPassword)=>{
            if(err){
                return err ;
            }
            const author = await prisma.user.create({
                data :{
                    username : "Steve Carell" ,
                    email : "steveCarell@gmail.com" ,
                    password : hashedPassword 
                }
            })
            console.log(author)
        })
       
    }catch(err){
        return err ;
    }
}


async function main(){
    const blogAuthor = await prisma.user.findUnique({
        where :{
            email : "steveCarell@gmail.com"
        }
    });
    console.log("BLOG AUTHOR : " )
    console.log(blogAuthor )
    if(!blogAuthor){
        createBlogAuthor()
    }
}

main();