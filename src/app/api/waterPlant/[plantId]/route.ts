// app/api/water-plant/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectMongoDB } from "@/lib/mongoose";
import Plant from "@/models/plant";

export async function GET(req: NextRequest, {params}: {params: {plantId:string}}) {
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!session) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plantId } = params;

    if (!plantId || !token) {
      return NextResponse.json({ success: false, message: "Missing plantId and token" }, { status: 400 });
    }

    await connectMongoDB();

    const plant = await Plant.findById(plantId);
    if (!plant || plant.waterToken !== token) {
      return NextResponse.json({ success: false, message: "Invalid or expired link" }, { status: 403 });
    }

    plant.lastWatered = new Date(); 
    plant.waterToken= null;
    await plant.save();

    return NextResponse.json({ success: true, message: "Plant watered" });
  } catch (error) {
    console.error("Water plant error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
