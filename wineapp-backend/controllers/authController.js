const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User.js");

// ✅ Inscription (Register)
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "Email déjà utilisé" });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({ name, email, password: hashedPassword });

    // Générer un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ✅ Connexion (Login)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Chercher l'utilisateur
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Utilisateur non trouvé" });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    // Générer un token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// ✅ Demande de réinitialisation du mot de passe
const passwordResetRequest = async (req, res) => {
  const { email } = req.body;

  try {
    // Vérification de la validité de l'email
    if (!email || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      return res.status(400).json({ message: "Email invalide" });
    }

    // Chercher l'utilisateur dans la base de données
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Générer un token JWT avec expiration de 1 heure pour la réinitialisation
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h", // Le token expire dans 1 heure
    });

    // Enregistrer le token et sa date d'expiration dans la base de données
    await user.update({
      passwordResetToken: token,
      passwordResetExpires: Date.now() + 3600000, // 1 heure d'expiration
    });

    // Configurer Nodemailer pour envoyer l'email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Réinitialisation du mot de passe",
      text: `Pour réinitialiser votre mot de passe, veuillez suivre ce lien : ${process.env.APP_URL}/reset-password/${token}`,
    };

    // Envoyer l'email avec le lien de réinitialisation
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email de réinitialisation envoyé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur d'envoi de l'email" });
  }
};

// ✅ Réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Chercher l'utilisateur à partir du token de réinitialisation
    const user = await User.findOne({ where: { passwordResetToken: token } });

    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Vérifier si le token a expiré
    if (user.passwordResetExpires < Date.now())
      return res.status(400).json({ message: "Token expiré" });

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur et supprimer le token
    await user.update({
      password: hashedPassword,
      passwordResetToken: null, // Supprimer le token après réinitialisation
      passwordResetExpires: null, // Supprimer la date d'expiration
    });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  passwordResetRequest,
  resetPassword,
};
