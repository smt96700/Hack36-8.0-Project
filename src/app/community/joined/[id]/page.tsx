'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CommunityDetailsPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const desc = searchParams.get('desc');
  const { id: communityId } = useParams();

  const { status, data: session } = useSession();

  const [postContent, setPostContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`/api/posts?communityId=${communityId}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchPosts();
    }
  }, [communityId]);

  const handleSubmit = async () => {
    if (!postContent.trim()) return;

    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/postGenerator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: postContent,
          communityId,
          createdBy: session?.user?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Post created successfully!');
        await fetchPosts();
      } else {
        setMessage('❌ Failed to create post.');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setMessage('❌ Error creating post.');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (postId: string, reactionType: string) => {
    try {
      const res = await fetch('/api/posts/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          reactionType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Refetch posts after updating the reaction
        fetchPosts();
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center mb-4">{name}</h1>
      <p className="text-gray-700 text-center mb-6">{desc}</p>

      {/* Post creation */}
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={4}
        placeholder="Write your post here..."
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
      >
        {loading ? 'Posting...' : 'Post It and Beautify'}
      </button>

      {/* Display Posts */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post, index) =>
            post?.content ? (
              <div key={index} className="mb-4 bg-gray-50 p-4 rounded-lg shadow-md transition transform hover:scale-105">
                <p className="text-lg text-gray-800">{post.content}</p>
                <span className="text-sm text-gray-500">— {post.author?.name || 'Unknown'}</span>

                {/* Reactions */}
                <div className="mt-4 flex items-center space-x-4">
                  <button
                    onClick={() => handleReaction(post._id, 'thumbsUp')}
                    className="text-green-600 hover:text-green-700 cursor-pointer"
                  >
                    👍 {post.reactions.thumbsUp}
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, 'smiley')}
                    className="text-yellow-600 hover:text-yellow-700 cursor-pointer"
                  >
                    😊 {post.reactions.smiley}
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, 'favorite')}
                    className="text-red-600 hover:text-red-700 cursor-pointer"
                  >
                    ⭐ {post.reactions.favorite}
                  </button>
                  <button
                    onClick={() => handleReaction(post._id, 'heart')}
                    className="text-pink-600 hover:text-pink-700 cursor-pointer"
                  >
                    ❤️ {post.reactions.heart}
                  </button>
                </div>
              </div>
            ) : null
          )
        ) : (
          <p className="text-gray-500 mt-4">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
