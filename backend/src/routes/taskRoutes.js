const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { createTask,  
        getTasks,
        updateTasks,
        deleteTask
    
         } = require("../controllers/taskController");



router.post(
    "/",
    authMiddleware,
    createTask
);

router.get(
     "/",
    authMiddleware,
    getTasks 
);

router.put(
    "/:id",
    authMiddleware,
    updateTasks
);

router.delete(
     "/:id",
    authMiddleware,
    deleteTask
)



module.exports = router;