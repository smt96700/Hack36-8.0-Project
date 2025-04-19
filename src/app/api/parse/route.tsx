import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {Julep } from "@julep/sdk";
import yaml from "yaml";
import { extractAdjacencyList } from "@/utils/responseParser";
import { injectEnv } from "@/utils/injectEnv"



export async function POST(req: Request) {
    try {
        const body = await req.json();
        const  userPlants = body;
        console.log(userPlants)

        if(!userPlants || !Array.isArray(userPlants)) {
            return NextResponse.json({
                error: 'Invalid input. Expected an array of user plants.',
            }, {status: 400});
        }
        
        const plantList = userPlants.join(', ');
        const question = `The user's garden contains the following plants: ${plantList}.

        Based on the document, identify the optimal companion planting strategies for these plants. Return the results as an adjacency list in the format:
        
        plantA -> [companion1, companion2, ...]
        
        Only include plants from the user's list if they have known companions in the document. Focus strictly on valid companion relationships and avoid speculative matches.
        Inclose the adjacency list in triple backticks.`;
        
       
        const pdfPath= path.join(process.cwd(), 'public', 'book', 'Carrots_Love_Tomatoes_Test.pdf');
        const fileBuffer= fs.readFileSync(pdfPath);
        const base64String = fileBuffer.toString('base64');

        const yamlPath = path.join(process.cwd(), 'src', 'config', 'config.yaml');
        const parsedYaml= yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
        const taskDefinition= injectEnv(parsedYaml)

        const client = new Julep({
            apiKey: process.env.JULEP_API_KEY,
        })

        const agent = await client.agents.create({
            name: 'LlamaParse Plant Companion Agent',
            about: 'An intelligent agent designed to extract and analyze content from gardening and plant-related PDF documents, with a focus on companion planting strategies, plant care, and ecosystem-friendly practices.',
          });
        
          console.log("Agent created:", agent.id);  
        const task= await client.tasks.create(agent.id, taskDefinition);

        const execution= await client.executions.create(task.id, {
            input: {
                file: base64String,
                filename: 'Carrots_Love_Tomatoes_Test.pdf',
                question: question,
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
            const adjacencyList = extractAdjacencyList(rawMessage);
            console.log("Adjacency List:", adjacencyList);
            return NextResponse.json(adjacencyList);    
           
          } else {
            return NextResponse.json({error: 'Failed to execute task', details: result}, {status: 500});
          }
        
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({error: 'Internal Server Error', details: error}, {status: 500});
    }
}

