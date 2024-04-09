import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    
    try{
        const {postID} = req.body;

        
            const users = await prisma.friends.delete({
                where: {
                    postID:postID
                }
                    
                })
        
    
        
        
        if (!users) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({
            message: "Post deleted"
        })
        }
        catch(error){
            // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }
