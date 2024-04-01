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

    callbacks: {
        async session({ session, token, user }) {
            if (token && token.role) {
                session.user.role = token.role; // Add the role to the session
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Include the role in the JWT
            }
            return token;
        }
    },
    
    secret: process.env.NEXTAUTH_SECRET,

})

