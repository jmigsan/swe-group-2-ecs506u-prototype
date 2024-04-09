import { prisma } from '@/pages/prismaClient';

export default async function handler(req,res){
    try{
        const {name, userEmail} = req.body;


        const users = await prisma.user.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { firstName: { startsWith: name } },
                            { firstName: { contains: name } }
                        ]
                    },
                    {
                        NOT: {
                            email: userEmail // specify the userEmail you want to exclude
                        }
                    },
                    {
                        role: "Investor"
                    }
                ]
            }
        });
        
        const userIsFriendArray =[]
        for (const user of users){
            const isFriend = await prisma.friends.findFirst({
                where: {
                    OR: [
                      { 
                        userID: userEmail, 
                        recipientID: user.email 
                      },
                      { 
                        userID: user.email, 
                        recipientID: userEmail 
                      }
                    ]
                  }
                });

            
            if (isFriend !== null){
                userIsFriendArray.push({
                    firstName:user.firstName,
                    email:user.email,
                    isFriend: isFriend.accepted})
            }
            else{
                userIsFriendArray.push({
                    firstName:user.firstName,
                    email:user.email,
                    isFriend: null})

            }
            
        }

       
       
        if (!users) {
            // If the user doesn't exist, return an error response
            return res.status(404).json({ error: 'User not found' });
        }

        
        res.status(200).json({
            users:userIsFriendArray   
        })
        }
        catch(error){
            // Handle any errors that occur during the process
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    }

