import jwt from 'jsonwebtoken';
import { users } from '../model/userSchema.js';

const jwtrouteprotect = async (req, res, next) => {

    try {
        const token = req.headers['authorization'].split(" ")[1]

        if (!token) {
            return res.status(401).json({ error: "Unauthorized  no Token Provided" });
        }

        try {
            const jwtresponse = jwt.verify(token, process.env.JWT_SKEY);

            const user = await users.findById(jwtresponse.userId).select("-password");

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            req.user = user;
            next();
        } catch (verifyError) {
            console.error("Error verifying token:", verifyError);
            return res.status(401).json({ error: "Unauthorized ! Invalid Token Provided" });
        }
    } catch (error) {
        console.error("Error in jwtrouteprotect middleware:", error);
        res.status(500).json({ error: 'Internal error' });
    }
};

export default jwtrouteprotect;


