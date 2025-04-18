import { connectMongoDB } from "@/lib/mongoose";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

// Define the type for the request body
interface RegisterUserBody {
  name: string;
  email: string;
}

export async function POST(request: Request) {
  // Type the request body to match RegisterUserBody
  const { name, email }: RegisterUserBody = await request.json();

  
  await User.create({ name, email });

  return NextResponse.json({ message: "User Registered" }, { status: 201 });
}

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({message: "Email is not provided"}, {status: 404});
    }

    const existingUser = await User.find({email: email});
    if (existingUser) {
      return NextResponse.json(existingUser, {status: 201});
    }
  } catch(err) {
    console.log(err);
    return NextResponse.json({message: "Error finding user"}, {status: 404});
  }
}
