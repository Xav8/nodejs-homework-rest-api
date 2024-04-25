const Contact = require("../models/contacts.js");

exports.listContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().exec();
    res.json(contacts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching contacts from the database" });
  }
};

exports.getContactById = async (req, res) => {
  const { id } = req.params;
  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.json(contact);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching contact" });
  }
};

exports.createContact = async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !phone || !email) {
    return res
      .status(400)
      .json({ message: "missing required name, email or phone field" });
  }

  try {
    const newContact = new Contact({
      name: name,
      email: email,
      phone: phone,
      favorite: req.body.favorite || false,
    });
    const createdContact = await newContact.save();
    res.status(201).json({
      id: createdContact._id,
      name: createdContact.name,
      email: createdContact.email,
      phone: createdContact.phone,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeContact = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id).exec();
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ message: "Error deleting contact" });
  }
};

exports.updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !phone || !email) {
    return res.status(400).json({ message: "missing fields" });
  }
  const filter = { _id: id };
  const update = { name, email, phone };

  try {
    const updatedContact = await Contact.findOneAndUpdate(filter, update);
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateStatusContact = async (contactId, updateFields) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updateFields,
      { new: true }
    );

    return updatedContact;
  } catch (error) {
    throw new Error("Error updating contact status: " + error.message);
  }
};
exports.updateContactFavorite = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  if (favorite === undefined) {
    return res.status(400).json({ message: "missing field favorite" });
  }
  try {
    const updatedContact = await updateStatusContact(id, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error updating contact favorite:", error);
    return res.status(500).json({ message: "Error updating contact favorite" });
  }
};