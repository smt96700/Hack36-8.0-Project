// import { Julep } from '@julep/sdk';
// import path from 'path';
// import yaml from "yaml";
// import fs from "fs";
// import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req:NextRequest) {
//     try {

//         const client = new Julep({
//             apiKey: process.env.JULEP_API_KEY
//           });
          
//           const agent = await client.agents.create({
//               name: "Post Description Refiner",
//               model: "claude-3.5-sonnet",
//               about: "A helpful AI assistant that improves a user's post description to be grammatically correct and more formal"
//             });
            
            
//             const task_definition = `
//             name: Post Description Refiner
//             description: Improve a user's post description to be grammatically correct and more formal.

//             main:
//             - prompt:
//               - role: system
//                 content: You are an assistant that refines and formalizes user-generated content.
//               - role: user
//                 content: >-
//                   $ f'''Original post description:
//                   "{steps[0].input.question}"
//                   Give refined post description
//                   '''
//             `;
//             // const yamlPath = path.join(process.cwd(), 'src', 'config', 'beautifyConfig.yaml');
//             // const taskDefinition= yaml.parse(fs.readFileSync(yamlPath, 'utf-8'));
          
//             const task = await client.tasks.create(
//               agent.id,
//               yaml.parse(task_definition)
//             );
//             const description ="tommorrow there is event about the anniversay of this plant of 5 years all are invited to the society compound."
//             const question = `The user has written the following post description: ${description}.
          
//           Please rewrite this description to be grammatically correct, clear, and more formal while preserving the original intent and meaning.
          
//           Return only the improved version of the description enclosed in triple backticks. Do not include any explanation or additional comments.`;
          
          
//             const execution = await client.executions.create(
//               task.id,
//               {
//                 input: { 
//                   question: question,
//               }
//               }
//             );
            
//             // Wait for the execution to complete
//             let result;
//             while (true) {
//               result = await client.executions.get(execution.id);
//               if (result.status === 'succeeded' || result.status === 'failed') break;
//               console.log(result.status);
//               await new Promise(resolve => setTimeout(resolve, 1000));
//             }
            
//             if (result.status === 'succeeded') {
//               const output = result.output as { choices: { message: { content: string } }[] };
//               const rawMessage= output.choices[0].message.content;
          
//               console.log(rawMessage);
//               return NextResponse.json(rawMessage, {status: 200});
//             } else {
//               console.error(`Error: ${result.error}`);
//               return NextResponse.json({message: result.error}, {status:500})
//             }          

//     } catch (err) {
//         console.log(err);
//         return NextResponse.json({message: "error making this chutiyap"}, {status:500})
//     }
// }

import { NextRequest, NextResponse } from "next/server";
import { Julep } from "@julep/sdk";
import yaml from "yaml";
import Post from "@/models/post"; // Make sure this is defined
import { connectMongoDB } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  await connectMongoDB();

  const { content, communityId, createdBy } = await req.json();

  console.log(content," ",communityId," ",createdBy);

  if (!content || !communityId || !createdBy) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const client = new Julep({ apiKey: process.env.JULEP_API_KEY });

    const agent = await client.agents.create({
      name: "Post Description Refiner",
      model: "claude-3.5-sonnet",
      about: "A helpful AI assistant that improves a user's post description to be grammatically correct and more formal",
    });

    const task_definition = `
      name: Post Description Refiner
      description: Improve a user's post description to be grammatically correct and more formal.

      main:
      - prompt:
        - role: system
          content: You are an assistant that refines and formalizes user-generated content.
        - role: user
          content: >-
            $ f'''Original post description:
            "{steps[0].input.question}"
            Give refined post description
            '''
    `;

    const task = await client.tasks.create(agent.id, yaml.parse(task_definition));

    const question = `The user has written the following post description: ${content}.
    Please rewrite this description to be grammatically correct, clear, and more formal while preserving the original intent and meaning.
    Return only the improved version of the description enclosed in triple backticks. Do not include any explanation or additional comments.`;

    const execution = await client.executions.create(task.id, {
      input: { question },
    });

    let result;
    while (true) {
      result = await client.executions.get(execution.id);
      if (result.status === "succeeded" || result.status === "failed") break;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (result.status === "succeeded") {
      const output = result.output as { choices: { message: { content: string } }[] };
      const rawMessage= output.choices[0].message.content;
      // Remove triple backticks if present
    const beautifiedContent = rawMessage.replace(/```/g, '').trim();
      // console.log(beautifiedContent);

      const newPost = new Post({
        content: beautifiedContent,
        communityId,
        author: createdBy,
      });

      await newPost.save();

      return NextResponse.json({ message: "Post created successfully", newPost }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Beautification failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
