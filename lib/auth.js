
import { getToken } from 'next-auth/jwt';
export default async function isAuthenticated(req){
    const secret = process.env.NEXTAUTH_SECRET;
    const token = await getToken({req, secret: secret, cookieName: "next-auth.session-token",});
    if(token){
        return true;
    }
    else{
        return false;
    }

}


