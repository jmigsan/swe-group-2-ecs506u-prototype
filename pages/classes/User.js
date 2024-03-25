import {prisma} from "@/pages/prismaClient";
import bcrypt from "bcryptjs";
export default class Users{

    instance = null;
    constructor(){
        this.instance= this;
    }

    // singleton design pattern. There will be a single Users registry which API routes
    // which API routes can communicated with to find users, their information, etc.
    static getInstance(){
        if(this.instance==null){
            this.instance= new Users();
            return this.instance;
        }
        else{
            return this.instance;
        }
    }
    // create a user with the given username, password, and email
    // returns true if successful creation
    // returns false if user already exists
    // uses findUniqueUser method to see if user exists
    createUser(name, email, password){

    }

    // deletes a user from the registry
    // returns true if successful deletion
    // returns false if incorrect credentials
    // or if user has balance/portfolio that is not empty
    deleteUser(username, password){

    }

    //finds a user with the given credentials
    // returns null if no user is found
    // returns the user otherwise
    // requiredFields is a boolean array that indicates
    // which fields to return of the user
    async findUniqueUser(username, requiredFields){
        try{
            const user = await prisma.users.findUnique({
                where:{
                    email:username,
                },

                select:{
                    firstName: requiredFields[0],
                    email:requiredFields[1],
                    password:requiredFields[2],
                }
            })

            if(user){
                return true;
            }

            else{
                return false;
            }
        }

        catch(error){
            return false;
        }

    }

    // returns a list of users that match the given query
    // requiredFields is a boolean array of which fields the method should return
    findAll(queryInfo, requiredFields){

    }

    // method to check if the inputted password matches the user's password
    // in database. If wrong, it returns false
    // else returns true
    // used in authorize function in nextAuth
    async checkPassword(username, inputted_password){
        
        try{
            const getUser = await prisma.users.findUnique({
                where: {
                    email: username,
                    },

                    select:{
                        firstName: true,
                        password: true,
                        email: true,
                        }
                })

                if(getUser===null){
                    return null;
                    }

                else{
                    const validPassword = await bcrypt.compare(inputted_password, getUser.password);
                    if(validPassword){
                        return getUser;
                    }
                    else{
                        return null;
                    }
                }
            }

            catch(error){
                return null
            }

    }

    //method to update user's data in database
    // checks if inputted_password matches the password in database
    // if matches, updates data, and returns true
    // else returns false
    async updatePassword(username, new_password){
        const hashedpassword = await bcrypt.hash(new_password, 10);
        console.log(hashedpassword);
        try{
            const update = await prisma.users.update({
                where:{
                    email: username,
                },

                data:{
                    password: hashedpassword,
                }
            })
            
            if(update){
                return true;
            }

            else{
                return false;
            }

        }

        catch{
            return false;
        }
    }
}