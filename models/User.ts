import mongoose, {Schema,model,models} from "mongoose";
import bcrypt from 'bcrypt';
//browser or nodejs don't understand typescript directly so:-
// TypeScript (.ts)
//       |
//       v  (compiled/transpiled)  //TypeScript Compiler (tsc) (or Babel, or Webpack with ts-loader) compiles typescript.
// JavaScript (.js)
//       |
//       v  (interpreted/executed)
// Browser / Node.js

//The types exist only at compile-time (for error checking) → disappear in the final JS.
//End result: always JavaScript runs in browser/Node.




// STEP-1 CREATE INTERFACE.
export interface IUser {//In TypeScript, an interface is a way to define a type (a contract/blueprint) for objects, classes, or functions.
 email: string;//email will be of type string.( email could also be of type IUser!!! as we created IUser as a type!)
 password: string;//this is the syntax of defining type of a variable or property!. (const variable: type = object of that type.) this is equivalent to const int bananas = 12 in java.
 _id?: mongoose.Types.ObjectId; //optional cuz maybe when user is logging in then there might not be an id, but when we're fetching a user from the database then id is required!
 createdAt?: Date;
 updatedAt?: Date;//same reason as for the _id for these two.

}


// STEP-2 CREATE SCHEMA USING THAT INTERFACE.
//below we are using the generic type we made,this is completely ts syntax, this doesn't exist at runtime.
const userSchema = new Schema<IUser>({  //schema will be of generic type IUser, now if the properties below have any different datatype or value then, we'll get an error as we defined the schema to be of IUser type.
    //what we're doing is giving schema a type, so unless that type is fulfilled typescript will give us an error.
    //and Schema() method takes an object as an argument.
    email: {type: String, required: true,unique: true, },//these are properties of mongoose btw...
    password: {type: String, required: true, }
},
{
    timestamps: true, //when we add timestamps true, mongoose automaically adds two fields to your schema: createdAt → Date when the document was first created ,updatedAt → Date when the document was last updated
})


// there are pre and post hooks that we get, pre when data is just about to be entered in database, and post hook is provided after data has entered the database.
//pre can be used in hashing the password just before the user data hits the database.

//STEP-3 RIGHT BEFORE THE DATA REACHES DATABASE, HASH THE PASSWORD.
userSchema.pre('save',async function(next){//save is the event, as in when data is being saved, perform this function that i'm passing pre/before that event.
//next is used if there are any other hooks then pass the control to that hook, these work just like middlewares.

if(this.isModified('password')){ //here this represents the user object that is going to the database.
//if the value 'password' is modified
this.password = await bcrypt.hash(this.password, 10)//10 is the salt or rounds.
//re-write the password as the hashed value.
}
next(); //call the next hook in the pipeline.
})


// STEP-4 CREATE A MODEL USING THAT SCHEMA WHICH WE CAN PERFORM SOME OPERATIONS ON.
// A Schema is just a blueprint/definition of how your data should look in MongoDB.
// A Model is a constructor (class) created from a Schema.
// It is what you actually use to interact with MongoDB (query, create, update, delete).
const User = models?.User || model<IUser>('User',userSchema); //if model already exists, then just give the User model from it, if it doesn't then create a model 
//that follows the type we defined, and is made of userSchema.

export default User;//this user model is what we will perform the operations on.
