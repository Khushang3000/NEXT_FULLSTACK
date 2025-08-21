import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
//next is different than normal express, it has NextRequest and NextResponse

//we can use zod for validation.
export async function POST(request: NextRequest){
    try {
        const {email, password} = await request.json()
                                  //in express data directly comes from frontend, in next tho, it takes some time.
        if(!email || !password){//if email and password aren't provided.
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            )
            //status 400-> bad request, the request is invalid, wrong format, malformed json, missing fields.
        }
        
        await connectToDB()//only after connecting to db we can perform the opertations.
        
        //now find user if he exists through email
        const existingUser = await User.findOne({email})
        
        if(existingUser){
            return NextResponse.json(
                {error: "User already registered"},
                {status: 400}
            )
        }

        await User.create({
            email,
            password
        })//timestamps will be automatically added due to schema we set up.

        return NextResponse.json(
            { message: "User registration successful" },
            {status: 400}
        )

    } catch (error) {
        console.error("Registration Error",error)
        return NextResponse.json(
            {error: "Failed to Register User"},
            {status: 400}
        )
    }
}