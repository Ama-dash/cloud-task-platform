const pool = require("../config/database");

const createTask  = async (req, res) => {

    const { title, description } = req.body;
    
    if (!title) {

        return res.status(400).json({
             message: "Task title is required"
        });
        
    }

    try {

        const result  = await pool.query( 
            `INSERT INTO tasks 
            (title, description, user_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                title,
                description,
                req.user.id
            ]
        );


        res.status(201).json({

            message: "Task created successfully",

            task: result.rows[0]

        });
            
       
            
        
        
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message:"Server error"
        });
    }
};


//Get all tasks where the user_id matches the logged-in user
const getTasks = async (req, res) => {
    try {

        const result = await pool.query(
            "SELECT * FROM tasks WHERE user_id = $1",
            [req.user.id]
        );

        res.json({

            tasks: result.rows    
        });

    }catch(error){
    console.log(error);
    
    res.status(500).json({
        message: "Server error"

    });
}

};

//update task
const updateTasks = async (req, res) => {


    //Get task ID
    const { id } = req.params;

    //Read the new data

    const { title, description, status} = req.body;
//update task by UPDATE function of query
    try {
        
        const result = await pool.query(
            `UPDATE tasks
             SET title = $1,
                 description = $2,
                 status = $3
             WHERE id = $4
             AND user_id = $5
             RETURNING *`,
            [
                title,
                description,
                status,
                id,
                req.user.id
            ]
        );

        if (result.rows.length  === 0 ) {

            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({

            message: "Task updated successfully",

            task: result.rows[0]
        });
            
        
    } catch (error) {

         console.log(error);

        res.status(500).json({
            message: "Server error"
        });
        
    }

};


const deleteTask = async (req, res) => {

     const { id } = req.params;

     try{

        const result = await pool.query(
            `DELETE FROM tasks
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [
                id,
                req.user.id
            ]
        );

        if (result.rows.length  === 0 ) {

            return res.status(404).json({
                message: "Task not found"
            });
            
        }

        res.json({

            message: "Task deleted successfully",

            task: result.rows[0]

        });

       } catch(error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

     };



       
module.exports = {
    createTask,
    getTasks,
    updateTasks,
    deleteTask
};