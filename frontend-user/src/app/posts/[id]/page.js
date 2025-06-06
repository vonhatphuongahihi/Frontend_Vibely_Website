"use client";
import { getSinglePost } from '@/service/post.service';
import { usePostStore } from '@/store/usePostStore';
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import PostCard from '../PostCard';

function Page() {
  const params = useParams();
  const postId = params.id;   //postId
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(false);
  const { handleReactPost, handleCommentPost, handleSharePost, handleDeletePost, handleEditPost } = usePostStore();
  const fetchPost = async () => {
    setLoading(true);
    try {
      const result = await getSinglePost(postId);
      setPost(result);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return (
    <div className='max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pt-16 mt-4'>
      {post &&
        <PostCard
          post={post}
          onReact={async (reactType) => {
            await handleReactPost(post?.id, reactType)
            await fetchPost()
          }}  // chức năng react
          onComment={async (commentText) => {  //chức năng comment
            await handleCommentPost(post?.id, commentText)
            await fetchPost()
          }}
          onShare={async () => {  //chức năng share
            await handleSharePost(post?.id)
            await fetchPost()
          }}
          onDelete={async () => {  //chức năng xóa
            await handleDeletePost(post?.id)
            await fetchPost()
          }}
          onEdit={async (postData) => {
            await handleEditPost(post?.id, postData)
            await fetchPost()
          }}
        />
      }
    </div>
  )
}

export default Page