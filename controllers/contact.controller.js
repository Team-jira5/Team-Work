import prisma from "../db/prisma.js";

export const createContact = async (req, res) => {
  try {
    const { nom, prenom, tel, email, adresse } = req.body;

    const contact = await prisma.contact.create({
      data: {
        nom,
        prenom,
        tel,
        email,
        adresse,
        enAttente: true,
        userId: req.user.id,  // Assurez-vous de stocker l'ID de l'utilisateur dans la base de données
      },
    });

    res.status(201).json({ message: "Contact créé avec succès", contact });
  } catch (err) {
    console.error("Erreur lors de la création :", err);
    res.status(500).json({ message: "Erreur lors de la création du contact" });
  }
};

export const removeContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Trouver le contact à supprimer
    const contact = await prisma.contact.findUnique({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    // Vérifier si l'utilisateur authentifié est le propriétaire du contact
    if (contact.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas les autorisations nécessaires" });
    }

    // Supprimer le contact
    await prisma.contact.delete({
      where: { id },
    });

    res.status(200).json({ message: "Contact supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ message: "Erreur lors de la suppression du contact" });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        userId: req.user.id,  // Récupérer uniquement les contacts de l'utilisateur authentifié
      },
    });
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Erreur lors de la récupération des contacts :", err);
    res.status(500).json({ message: "Erreur lors de la récupération des contacts" });
  }
};
