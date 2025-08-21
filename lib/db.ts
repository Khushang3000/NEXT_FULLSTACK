import mongoose from "mongoose";
import { cache } from "react";

//in nextjs we don't need additional packages like dotenv for importing env variables!!!, if this was js file we wouldn't get any errors, but since it's ts
//ts needs the type of MONGODB_URI, by default it only knows Node’s built-in variables (NODE_ENV, TZ, etc.)
//to add types of custom env variables we need to create a declaration file for env: env.d.ts and add types like:
// namespace NodeJS {
//   interface ProcessEnv {
//     MONGODB_URI: string;  // type string
//     DB_HOST?: string;     // optional string
//     DB_USER?: string;     // optional string
//     DB_PASS?: string;     // optional string
//     NODE_ENV: 'development' | 'production' | 'test';
//   }
// }

//or we coulda done const MONGODB_URI = process.env.MONGODB_URI as string
//but then:
// No global autocomplete: If you type process.env. in another file, TypeScript won’t know about MONGODB_URI.

// No type safety across your project: You could mistype process.env.MONGODB_URI elsewhere and TS won’t catch it.

// You still need a runtime check to ensure it actually exists:

// if (!MONGODB_URI) {
//   throw new Error("MONGODB_URI is missing in .env");
// }
const MONGODB_URI = process.env.MONGODB_URI! ; // '!' tells ts I guarantee this value is not null or undefined, so don’t complain about possible undefined.
//NOTE: IF YOU SIMPLY RUN JUST THIS FILE LIKE node db.ts then env variables won't be loaded as we're running just this specific file rather than the whole app.
// if(!MONGODB_URI){//we are putting our custom check on if mongodb_uri doesn't exist.
//     throw new Error("Define MONGODB_URI in ENV VARIABLES")
// }


let cached = global.mongoose


if(!cached){
//if cached doesn't exist then set the global variables to null, and store the new global.mongoose(whose variables are null) in cached.
    cached = global.mongoose = {conn: null, prom: null}
}


export async function connectToDB(){
    if(cached.conn){
        //if there already is a connection in cached variable return the connection
    }

    if(!cached.prom){
        //if there is no promise(i.e null, not rejected or pending(on the way) or resolved) in cached it means there's no connection as well! 
        //so we have to connect the database and send that connection promise.

        const opts = {//these options decide which plan of mongo are you using. we'll use free plan so we don't need to pass anything.
            bufferCommands: true,
            maxPoolSize: 10 //n.o of databases used.
            //these are for pro subscription, if no pro subscription then don't pass opts.
        }

        cached.prom = mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection) //on fulfillment this promise will return the conenction.
    }

    try {//
        cached.conn = await cached.prom
    } catch (error) {
        //if there's an error then set promise to null and return the error.
        cached.prom = null;
        throw error;
    }

    return cached.conn;//return the connection.
}
//now our models and database are ready!!!
//now we do authentication in nextjs. we can use clerk, passportjs or nextauth. we'll use nextauth.
//see nextauth documentation. then go to ts.
// [...nextauthjs], we also need to give types to nextauth in declaration file.