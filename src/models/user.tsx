import mongoose, { models, Schema } from "mongoose";
const userSchema =new Schema(
    {
        email:{
            type:String,
            required:true,
        },
        name: {
            type:String,
            required:true,
        },
        joinedCommunities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }],

    },
    {timestamps:true}
);

const User =models.User || mongoose.model("User",userSchema);
export default User;