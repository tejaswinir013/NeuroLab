const router = require("express").Router();
const c = require("../controllers/experimentController");

router.post("/", c.createExperiment);
router.get("/", c.getExperiments);
router.get("/:id", c.getExperiment);
router.delete("/:id", c.deleteExperiment);

module.exports = router;