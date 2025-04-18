import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongoose';
import Plant from '@/model/plant';
import { responseCookiesToRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log(body)
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return new Response(JSON.stringify({ message: 'User ID missing' }), { status: 400 });
  }
  
  body["createdBy"] = userId;
  await connectMongoDB(); 
  try {
    const plant = await Plant.create(body);
    return NextResponse.json(plant, { status: 201 });
  } catch (err) {
    console.log(err)
    return NextResponse.json({ message: 'Error creating plant' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  await connectMongoDB(); 
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ message: 'User ID missing' }), { status: 400 });
    }
    const plants = await Plant.find({
      "$or": [
        { createdBy: userId },
        { nominee: userId }
      ]
    }).sort({ dateAdded: -1 });
    return NextResponse.json(plants);
  } catch(err) {
    return NextResponse.json({message: 'Error fetching plants'}, {status: 400})
  }
}

export async function DELETE(req: NextRequest) {
  await connectMongoDB();
  try {
    const plantId = req.nextUrl.searchParams.get("plantId");
    
    if(!plantId){
      return NextResponse.json({message: 'PlantId is missing'}, { status: 400});
    }

    const deleted = await Plant.findByIdAndDelete(plantId);
    console.log(deleted);

    if(!deleted) {
      return NextResponse.json({message: 'PlantId not Found'}, {status: 404});
    }

    return NextResponse.json({message: 'Plant deleted successfully',deleted}, {status: 200});

  } catch (error) {
    console.error("Delete error: ",error);
    return NextResponse.json({message: 'Internal Server Error'}, {status: 500});
  }
}

export async function PUT(req: NextRequest) {
  try {
    const plantId = req.nextUrl.searchParams.get('plantId');
    if (!plantId || plantId === undefined) {
      return NextResponse.json({message: "Missing PlantId in Url"}, {status:400});
    }

    const res = await Plant.findByIdAndUpdate(plantId, {
      handover:false,
      "$unset" : {nominee:1}
    }, { new: true });

    if (!res) return NextResponse.json({message: 'PlantId not Found'}, {status: 404});
    return NextResponse.json(res, {status:200});

  } catch (error) {
    console.log(error);
    return NextResponse.json({message: error}, {status : 500})
  }
}
