import mongoose, {model , Schema} from "mongoose";
mongoose.connect("mongodb+srv://dipshadas4:Dips2004@cluster0.a46rpah.mongodb.net/thoughtsync-db-app")
.then(() => console.log("Connected to db"))
.catch(err => console.error("db connection error : ",err))
//won't enforce on db level only mongoose, u can break this rules if you are directly inserting in db
const userSchema = new Schema({
   username : {type: String , unique : true},
   password :{type:String}
})
const ContentSchema = new Schema ({
  title : String,
  link: String,
  tags:[{type : mongoose.Types.ObjectId , ref: 'Tag'}],
  userId : {type : mongoose.Types.ObjectId , ref : 'User',required : true}
})

export const UserModel =  model("User",userSchema) 
export const ContentModel = model("Content",ContentSchema)