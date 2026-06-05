import { connectToDB } from '@/lib/db';
import Post from '@/models/Post';
import { NextResponse } from 'next/server';


// Create a comment
export const POST = async (req:any) => {
  await connectToDB();

  try {
    const { postId, content, userId } = await req.json();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Cannot find post' });
    }

    const comment = {
      content,
      user: userId,
    };

    post.comments.push(comment);
    await post.save();

    return NextResponse.json({ message: 'SUCCESS', post });
  } catch (err:any) {
    return NextResponse.json({ message: err.message });
  }
};

// Delete a comment
export const DELETE = async (req:any) => {
  await connectToDB();

  try {
    const { postId, commentId } = await req.json();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Cannot find post' });
    }

    post.comments.id(commentId).remove();
    await post.save();

    return NextResponse.json({ message: 'SUCCESS', post });
  } catch (err:any) {
    return NextResponse.json({ message: err.message });
  }
};

// Upvote a comment
export const PATCH = async (req:any) => {
  await connectToDB();

  try {
    const { postId, commentId, userId } = await req.json();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: 'Cannot find post' });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return NextResponse.json({ message: 'Cannot find comment' });
    }

    if (!comment.upvotes.includes(userId)) {
      comment.upvotes.push(userId);
      await post.save();
    }

    return NextResponse.json({ message: 'SUCCESS', comment });
  } catch (err:any) {
    return NextResponse.json({ message: err.message });
  }
};
