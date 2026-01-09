'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCommentsByPost, createComment } from '@/lib/api';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [author, setAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  
  const queryClient = useQueryClient();

  const { data: comments } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPost(postId),
  });

  const mutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setAuthor('');
      setEmail('');
      setContent('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      content,
      author,
      email,
      post_id: postId,
    });
  };

  return (
    <div className="border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">コメント</h2>

      {comments && comments.length > 0 && (
        <div className="space-y-4 mb-8">
          {comments.map((comment: any) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold">{comment.author}</span>
                <span className="text-sm text-gray-500">
                  {format(new Date(comment.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-semibold">コメントを投稿</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="名前"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border rounded-lg px-4 py-2"
          />
        </div>
        
        <textarea
          placeholder="コメント内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="w-full border rounded-lg px-4 py-2"
        />
        
        <button
          type="submit"
          disabled={mutation.isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {mutation.isPending ? '投稿中...' : 'コメントを投稿'}
        </button>
      </form>
    </div>
  );
}
