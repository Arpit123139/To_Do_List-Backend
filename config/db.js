const mongoose=require('mongoose')
const connectDB=async ()=>{

    const connect=await mongoose.connect(process.env.MONGO_URI)
    console.log(`Connected to the Database ${connect.connection.host}`)
    
}

module.exports=connectDB