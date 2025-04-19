import { NextRequest, NextResponse } from "next/server";
import Request from '@/models/requestSchema';
import Plant from "@/models/plant";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const request = await Request.create(body);

        return NextResponse.json(request, {status: 201});
    } catch (error) {
        console.log(error)
        return NextResponse.json({ message: 'Error creating request' }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = req.nextUrl.searchParams.get('userId');

        if (!userId || userId === 'undefined') {
            return NextResponse.json({ message: 'User ID missing' }, { status: 400 });
        }

        const requests = await Request.find({to : userId}).sort({dateAdded: 1});
        return NextResponse.json(requests, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error fetching requests' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const reqId = req.nextUrl.searchParams.get('reqId');
        if (!reqId || reqId === 'undefined') {
            return NextResponse.json({ message: 'Request ID missing' }, { status: 400 });
        }
        console.log("Request ID: ", reqId)
        const request = await Request.findByIdAndUpdate(reqId, { accept: true }, { new: true });
        if (!request) {
            return NextResponse.json({ message: 'Request not found' }, { status: 404 });
        }
        const res = await Plant.findByIdAndUpdate(request.plantId, { handover: true, nominee: request.to }, { new: true });
        return NextResponse.json(res, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error updating request' }, { status: 500 });
    }
}