import jwt, { decode } from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "some_random_secret_key_for_access_token";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) { return res.status(401).json({ success:false,message: ["No token provided"] }) }
    try {
        const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
        if (!decoded) {
            return res.status(403).json({ success:false,message: "Invalid token" });
        }
        req.user = decoded;
    } catch (error) {
        console.log("error", error);
        return res.status(401).json({ success:false,message: ["Invalid or expired token"] });
    }  
    next()
}