import { NextResponse } from 'next/server';
import { scheduleReminder } from '@/lib/agenda';
import Plant from '@/models/plant';
import { connectMongoDB } from '@/lib/mongoose';
import { getWaterRequirements } from '@/utils/getWaterRequirements';



export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { plantId } = body;
        console.log("plantId", plantId)

        if (!plantId) {
            return NextResponse.json({ error: 'plantId is required' }, { status: 400 });
        }
        await connectMongoDB();
        const plant = await getPlantData(plantId);
        console.log("plant data", plant);
        if (!plant) {
            return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
        }
        const water_requirements:any= await getWaterRequirements(plant.name);
        console.log("Water requirements of plant: ",water_requirements)
        let dryTime;
        if(!water_requirements) {
            return NextResponse.json({ error: 'water_requirement fetch error' });
         
        }
        dryTime= water_requirements['Dry time calculation']
        const lastWatered = plant.lastWatered;
        
        if (!lastWatered || !dryTime) {
            return NextResponse.json({ error: 'Incomplete plant data' }, { status: 400 });
        }
        console.log("Data regarding watering schedule:",lastWatered, dryTime);

        const nextWateringTime = new Date(lastWatered);
       
        nextWateringTime.setHours(nextWateringTime.getHours() + dryTime); 

        await scheduleReminder(nextWateringTime, plant.createdBy._id, plant._id);

        return NextResponse.json({ message: 'Reminder scheduled successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error scheduling reminder:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function getPlantData(plantId: string) {
    try {
        const plant = await Plant.findById(plantId).populate('createdBy nominee');
        if (!plant) {
            return null;
        }
        return plant;
    } catch (error) {
        console.error("Error fetching plant data:", error);
        return null;
    }
}
