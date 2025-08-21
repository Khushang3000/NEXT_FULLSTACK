//in this file we declare types.
import { Connection } from "mongoose";

declare global{//declaring the following in global environment that's accessible throught the application!
    var mongoose:{
        conn: Connection | null;
        prom: Promise<Connection> | null,
    }

}

export {} //export empty
//everything here is available throughout the app.
//we don't need to import external package for the .env as nodejs provides that, we'll see in the lib/utils folder.