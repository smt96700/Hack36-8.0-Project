import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {Julep } from "@julep/sdk";
import yaml from "yaml";
import { extractAdjacencyList } from "@/utils/responseParser";
import { injectEnv } from "@/utils/injectEnv"
import {parseWaterSchedule} from '@/utils/responseParser'


export async function getWaterRequirements(plantName:string, city:string) {
    try {
        
        if(!plantName || !city) {
            return NextResponse.json({
                error: 'Invalid input. Expected a valid plant name.',
            }, {status: 400});
        }
        
        // const plantList = name.join(', ');
        // console.log(plantList)
        const question = `Give the regional evaluations value for ${plantName}.`;
        
       
        const pdfPath= path.join(process.cwd(), 'public', 'book', 'KcValuesOfPlants.pdf');
        const fileBuffer= fs.readFileSync(pdfPath);
        const base64String = fileBuffer.toString('base64');

        const yamlPath = path.join(process.cwd(), 'src', 'config', 'plants', 'watering_requirements.yaml');
        const parsedYaml= yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
        const taskDefinition= injectEnv(parsedYaml)

        const client = new Julep({
            apiKey: process.env.JULEP_API_KEY,
        })

        const agent = await client.agents.create({
            name: 'Weather Aware Plant Watering Advisor',
            about: 'An intelligent agent that analyzes plant type, size, and real-time weather data to recommend accurate watering schedules. Designed to help users optimize plant health while conserving water through personalized, weather-aware guidance.',
        })
        
          console.log("Agent created:", agent.id);  
        const task= await client.tasks.create(agent.id, taskDefinition);
        console.log("Task created:", city);
        const execution= await client.executions.create(task.id, {
            input: {
                file: base64String,
                filename: 'KcValuesOfPlants.pdf',
                question: question,
                plant_name: plantName,
                location: "Lucknow",
            }
        });

        let result;
        while (true) {
            result = await client.executions.get(execution.id);
            if (result.status === 'succeeded' || result.status === 'failed') break;
            console.log(result.status);
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }

          if(result.status === 'succeeded') {
            const output = result.output as { choices: { message: { content: string } }[] };
            const rawMessage= output.choices[0].message.content;
            console.log(rawMessage)
            const schedule = parseWaterSchedule(rawMessage)

            console.log(schedule)
            return schedule;   
           
          } else {
            throw new Error('Failed to execute task');
          }
        
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Internal Server Error");
    }
}


