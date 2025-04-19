import { connectMongoDB } from "@/lib/mongoose";
import Community from "@/models/community";
import Plant from "@/models/plant";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    await connectMongoDB();
    const longitude= req.nextUrl.searchParams.get("longitude");
    const latitude= req.nextUrl.searchParams.get("latitude");
    const maxDist = req.nextUrl.searchParams.get("maxDist");
    console.log(longitude," ",latitude," ",maxDist);
    try {
        const communities = await Community.find({
            location: {
              "$near": {
                "$geometry": {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                "$maxDistance": maxDist, // in meters 
              },
            },
          });
          console.log(communities)

          if(!communities)
          {
            return NextResponse.json({message:"Error fetching communities"},{status: 500});
          }

          return NextResponse.json(communities,{status:200});
    } catch (error) {
        console.error("Error fetching communities",error);
        return NextResponse.json({message:"Error fetching communities(server)"},{status: 500});
    }
}

export async function POST(req: NextRequest) {
  await connectMongoDB();
  try {
    const body = await req.json();
    const {userId, communityId} = body;

    if(!userId || !communityId)
    {
      return NextResponse.json({message: " Missing userId or communityId"}, {status: 400});
    }

    const community = await Community.findById(communityId);
    if(!community)
    {
      return NextResponse.json({message: "community not found"}, {status: 404});
    }

    if(!community.members.includes(userId)){
      community.members.push(userId);
      await community.save();
      await User.findByIdAndUpdate(userId, {
        $addToSet: { joinedCommunities: community._id },
        });
    }

    return NextResponse.json({message: "Joined Community Successfully"}, {status: 200});
  } catch (error) {
    return NextResponse.json({message: "server Error joining Community"}, { status: 500});
  }
}
