import { connectToDB } from '@/lib/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';

// Create a post
export const POST = async (req) => {
  await connectToDB();

  try {
    const { title, content, ultimateSuggestion } = await req.json();
    const post = new Post({
      title,
      content,
      ultimateSuggestion,
    });
    const newPost = await post.save();
    return NextResponse.json({ message: 'SUCCESS', newPost });
  } catch (err) {
    return NextResponse.json({ message: err.message });
  }
};

// Get all posts
export const GET = async () => {
  await connectToDB();

  try {
    const posts = await Post.find().populate('comments.user', 'username email');
    return NextResponse.json({ message: 'SUCCESS', posts });
  } catch (err) {
    return NextResponse.json({ message: err.message });
  }
};

// Delete a post
export const DELETE = async (req) => {
  await connectToDB();

  try {
    const { postId } = await req.json();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Cannot find post' });
    }

    await post.remove();
    return NextResponse.json({ message: 'SUCCESS' });
  } catch (err) {
    return NextResponse.json({ message: err.message });
  }
};

// Update a post
export const PATCH = async (req) => {
  await connectToDB();

  try {
    const { postId, title, content, ultimateSuggestion } = await req.json();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Cannot find post' });
    }

    if (title) post.title = title;
    if (content) post.content = content;
    if (ultimateSuggestion) post.ultimateSuggestion = ultimateSuggestion;

    const updatedPost = await post.save();
    return NextResponse.json({ message: 'SUCCESS', updatedPost });
  } catch (err) {
    return NextResponse.json({ message: err.message });
  }
};
