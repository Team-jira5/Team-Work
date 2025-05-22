// middleware/auth.js
import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Décoder le token et ajouter les informations de l'utilisateur à la requête
    next();  // Passer à la route suivante
  } catch (error) {
    return res.status(401).json({ message: 'Non autorisé' });
  }
};

export default authenticate;
