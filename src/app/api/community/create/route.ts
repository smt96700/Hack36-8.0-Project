import { connectMongoDB } from "@/lib/mongoose";
import Community from "@/models/community"; 
import Plant from "@/models/plant"; 
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectMongoDB();
    try {
        const body = await req.json();
        const userId = req.nextUrl.searchParams.get("userId");
        console.log(userId);
        if(!userId || userId===undefined)
        {
            return NextResponse.json({message:"userId not found"}, {status:400}); 
        }
        const {communityName, plantName, description, latitude, longitude} = body;

        // Now we are creating the plant first by using plantName and createdBy;
        const plant = await Plant.create({
            name: plantName,
            createdBy: userId,
            isCommunity: true,
        })

        const plantId = plant._id; // The plant Id that we will use in creating a community.
        console.log(communityName,plantName,description,);

        const community = await Community.create({
            communityName,
            plantId,
            description,
            createdBy: userId,
            members:[userId], // we are also adding the one who created the community, so that for future references, 
            // the admin(the one who created the community) will also be created as one of the members.
            location:{
                type: "Point",
                coordinates:[longitude,latitude],
            }
        })

        await User.findByIdAndUpdate(userId, {
            $addToSet: { joinedCommunities: community._id },
          });

        return NextResponse.json({message: "Community created successfully", community},{status: 201});

    } catch (error) {
        console.error("Error creating Community",error);
        return NextResponse.json({message:"Failed to create Community(Server Error)"},{status: 500});
    }
}