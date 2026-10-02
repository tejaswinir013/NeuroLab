const router = require("express").Router();
const c = require("../controllers/responseController");

router.post("/", c.saveResponse);
router.get("/:experimentId", c.getResponses);
router.get("/:experimentId/csv", c.exportCsv);

module.exports = router;