import mongoose, {Schema,model,models} from "mongoose";

// we'll use it below, this is not an interface, we could have made it one tho.
export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;//this is again typescript, we're exporting this as const otherwise it will get overriden.

//STEP1-CREATE INTERFACE FOR SCHEMA DATATYPE.
export interface IVideo {
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string; 
    videoUrl: string;
    thumbnailUrl: string; 
    controls: boolean;
    transformation?:{
        height: number;
        width: number;
        quality?: number; 
    }//we could have passed video_dimensions but they aren't interface!!!(datatype)
}

//STEP-2 CREATE SCHEMA
const videoSchema = new Schema<IVideo>({
    title: {type:String, required: true,},
    description: {type:String, required: true,},
    videoUrl: {type:String, required: true, },
    thumbnailUrl: {type:String, required: true, },
    controls: {type:Boolean, default: true},
    transformation: {
        height:{type: Number, default: VIDEO_DIMENSIONS.height},
        width:{type: Number, default: VIDEO_DIMENSIONS.width},
        quality:{type: Number, min:1, max:100}
    }

    },
    {
        timestamps: true
    }
)

//STEP-3 CREATE A MODEL BASED OF OF THAT SCHEMA.
const Video = models?.Video || model<IVideo>('Video',videoSchema);

export default Video;

// NOW WE JUST NEED TO CONNECT TO THE DATABASE!!!
//now, since nextjs has multiple servers all accross the world, when we make an api request, it goes on all the servers as they are interconnected
// that's why we checked that if models?.Video already has it then give me that, 
//same with database, we first need to check if connection is already established or not, if not then only we connect to mongodb database.
//now there can be three states of database, 
// 1. connected.
// 2. not connected.
// 3. promise on the way.
// types.d.ts.