import Pusher from 'pusher';

const pusher = new Pusher({
  appId: "1781413",
  key: "4eb774d0a818c0f71273",
  secret: "1dc3c67db8ae47522435",
  cluster: "eu",
  useTLS: true
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const { username, message } = req.body;
        
      try {
        await pusher.trigger('chat', 'message', {
          user: username,
          message: message
        });
        
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }
  }

  


