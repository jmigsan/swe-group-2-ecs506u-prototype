import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Users from "@/pages/classes/User"
export default NextAuth({
    providers:[
        CredentialsProvider(
            {
                name: "credentials",
                credentials:{

                },
                async authorize(credentials) {
                    try{
                        const registry = Users.getInstance();
                        const {username, password} = credentials;
                       
                        const res= await registry.checkPassword(username, password);
                        
                        return res;
                    }

                    catch(error){
                        
                        console.log(error);
                        return null;
                    }
                }            
            }
        )
    ],
    session: {
        strategy: "jwt",
    },

    secret: process.env.NEXTAUTH_SECRET,

})

