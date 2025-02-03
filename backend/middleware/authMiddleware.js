import jwt from "jsonwebtoken";

export function middleware(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: Token missing or invalid format" });
        }

        const token = authHeader.split(" ")[1];
        const decodedData = jwt.verify(token, "anshulsecret");

        req.userId = decodedData.userId;
        next(); 
    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
}
