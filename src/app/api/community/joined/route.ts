import { connectMongoDB } from "@/lib/mongoose";
import Community from "@/models/community";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(req: NextRequest) {
    await connectMongoDB();
    const userId = req.nextUrl.searchParams.get("userId");
    // console.log("userId ",userId);
    if (!userId) {
        return NextResponse.json({ message: "User ID is required" }, { status: 400 });
      }
      try {
        console.log(Community); //  added to handle missing schema error
        const user = await User.findById(userId).populate({
          path: "joinedCommunities",
          model: "Community" // explicitly specify the model
        });
    
        if (!user) {
          return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        // console.log(user.joinedCommunities)
    
        return NextResponse.json(user.joinedCommunities, { status: 200 });
      } catch (error) {
        console.error("Error fetching joined communities:", error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
      }
}
