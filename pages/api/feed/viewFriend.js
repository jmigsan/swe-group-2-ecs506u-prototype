import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    
    try{
        const {userEmail} = req.body;


        const users = await prisma.friends.findMany({
            where: {
                OR:[
                {userID: userEmail },
                {recipientID: userEmail}
                ],
                accepted: true
            }
        })



        console.log(users,"here22");
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
        console.log(friends)
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

