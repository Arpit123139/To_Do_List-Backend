const express = require('express')
const router = express.Router();
const auth = require('../middleware/user_jwt')                                     //To get the id of the user 
const Todo = require('../models/Todo');

const User = require('../models/user')

// Create new ToDo task 
router.post('/', auth, async (req, res, next) => {

    try {
        const todo = await Todo.create({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
        })

        if (!todo) {
            return res.status(400).json({
                success: false,
                msg: "Something Went wrong Task NOT CREATED"
            })
        }

        return res.status(200).json({
            success: true,
            msg: "Task CREATED SUCCESSFULLY!!!!!!!!!!!!!!111",
            todo: todo
        })




    } catch (err) {
        next(err);
    }
})

router.get('/', auth, async (req, res, next) => {

    try {
        const todo = await Todo.find({ user: req.user.id, finished: false });
        if (!todo) {
            return res.status(400).json({
                success: false,
                msg:"task Not Created or Completed!!!!!!!!!!"
            })
        }
        return res.status(200).json({
            success:true,
            count:todo.length,
            todos:todo,
            msg:"Successfulll"
        })
    } catch (error) {

    }

})

router.put('/:id',async(req,res,next)=>{

    try {
        let todo=await Todo.findById(req.params.id);
        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"todo Not Exsist"
            })
        }

        todo=await Todo.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true                    // It will verify the key data that we pass in the json Object 
        })

        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"Not Able To Update"
            })
        }
        return res.status(200).json({
            success:true,
            msg:"Successfully updated",
            todo:todo
        })
        
    } catch (error) {
        next(error)
        
    }
})

router.delete('/:id',async(req,res,next)=>{

    try {
        let todo=await Todo.findById(req.params.id);
        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"todo Not Exsist"
            })
        }

        todo=await Todo.findByIdAndDelete(req.params.id)

        if(!todo){
            return res.status(400).json({
                success:false,
                msg:"Not Able To Delete"
            })
        }
        return res.status(200).json({
            success:true,
            msg:"Successfully Deleted",
            todo:todo
        })
        
    } catch (error) {
        next(error)
        
    }
})

router.get('/finished', auth, async (req, res, next) => {

    try {
        const todo = await Todo.find({ user: req.user.id, finished: true });
        if (!todo) {
            return res.status(400).json({
                success: false,
                msg:"task Not Created or Completed!!!!!!!!!!"
            })
        }
        return res.status(200).json({
            success:true,
            count:todo.length,
            todos:todo,
            msg:"Successfulll"
        })
    } catch (error) {

    }
})

module.exports = router