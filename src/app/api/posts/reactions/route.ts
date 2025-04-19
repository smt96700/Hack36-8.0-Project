import { connectMongoDB } from "@/lib/mongoose";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await connectMongoDB();

    const body = await req.json();
    const { postId, reactionType } = body;

    if (!postId || !reactionType) {
        return NextResponse.json({ message: 'Post ID and Reaction Type are required' }, { status: 400 });
    }

    const validReactions = ['thumbsUp', 'smiley', 'favorite', 'heart'];
    if (!validReactions.includes(reactionType)) {
        return NextResponse.json({ message: 'Invalid reaction type' }, { status: 400 });
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return NextResponse.json({ message: 'Post not found' }, { status: 404 });
        }

        if (post.reactions[reactionType] !== undefined) {
            post.reactions[reactionType] += 1; // Increment the reaction count
        } else {
            post.reactions[reactionType] = 1; // Initialize reaction if it doesn't exist
        }

        await post.save();

        return NextResponse.json({ message: 'Reaction updated successfully', post }, { status: 200 });
    } catch (error) {
        console.error('Error updating reaction:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
