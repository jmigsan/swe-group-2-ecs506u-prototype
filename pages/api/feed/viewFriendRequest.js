import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    
    try{
        const {userEmail} = req.body;


        const users = await prisma.friends.findMany({
            where: {
                
                
                recipientID: userEmail, // we only check to see if recipient id matches as that means ththey are the one being sent a request
                // if you send a friend request to someone you wont see a "pop up"
                
                accepted: false
            }
        })



        
        const friends = users.map(user => {
            if (user.userID === userEmail){
                return [user.friendID,user.recipientID]
            }
            else if (user.recipientID === userEmail){
                return [user.friendID,user.userID];

            }else{
                return null;
            }
        }).filter(email => email !== null);

        if (!users) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({
            users:{ 
                friends
                   // add more details if you wish
            }
        })
        }
        catch(error){
            // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }

