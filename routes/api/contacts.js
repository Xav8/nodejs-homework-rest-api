const express = require("express");
const router = express.Router();
const contactController = require("../../controllers/contactsControllers");

router.get("/", contactController.listContacts);
router.get("/:id", contactController.getContactById);
router.post("/", contactController.createContact);
router.put("/:id", contactController.updateContact);
router.patch("/:id/favorite", contactController.updateContactFavorite);
router.delete("/:id", contactController.removeContact);
module.exports = router;