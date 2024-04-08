import Users from "@/pages/classes/User";
export default async function handler(req, res){
    const body = req.body;
    const username = body.username;
    const new_password = body.initial_password;

    const registry = Users.getInstance();
    // update the password using helper method in users class
    const update = registry.updatePassword(username, new_password);

    if(update) {res.status(200).json({message: "Password updated successfully"})}
    else{res.status(404).json({message: "Password not updated successfully"})}
}