import { connectMongoDB } from '@/lib/mongoose';
import Post from '@/models/post';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    // console.log("HEllo");
    const communityId = req.nextUrl.searchParams.get('communityId');

    if (!communityId) {
      return NextResponse.json({ message: 'Missing communityId' }, { status: 400 });
    }

    // const posts = await Post.find({ communityId: communityId })
    //   .sort({ createdAt: -1 })
    //   .lean();
    //   console.log(posts)
    const posts = await Post.find({ communityId })
      .populate('author', 'name') // This populates only the `name` field from User
      .sort({ createdAt: -1 });

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 });
  }
}
