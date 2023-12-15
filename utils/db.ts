import mongoose  from 'mongoose';

const db_URL:string= process.env.DB_URI || ""


 const connectDB = async ()=>{
    try {
        await mongoose.connect(db_URL).then((data:any)=>{
            console.log("Database Connected Successfully")
        })
    } catch (error:any) {
        console.log("Database Connection Error")
        setTimeout(connectDB,5000)
        
    }
}

export default connectDB