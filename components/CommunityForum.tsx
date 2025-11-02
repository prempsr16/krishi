import React, { useState, useContext } from 'react';
import type { ForumPost } from '../types';
import { LanguageContext } from '../App';

const initialPosts: ForumPost[] = [
    {
        id: '1',
        author: 'Ramesh Patel',
        timestamp: '2 hours ago',
        content: 'My tomato plants are showing yellow leaves with brown spots. Is this early blight? What is the best organic solution?',
        imageUrl: 'https://images.pexels.com/photos/193090/pexels-photo-193090.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
        likes: 12,
        comments: [
            { author: 'Sunita Sharma', text: 'Looks like it. Try a neem oil spray. It has worked for me.' },
            { author: 'KrishiGPT', text: 'This does seem like early blight. Sunita\'s suggestion of neem oil is a good organic start. Also, ensure good air circulation around plants and avoid overhead watering.' }
        ],
    },
    {
        id: '2',
        author: 'Anjali Singh',
        timestamp: '1 day ago',
        content: 'Good news! The market price for onions in Nashik has gone up. A good time to sell if you have stock.',
        likes: 35,
        comments: [
            { author: 'Vijay Kumar', text: 'Thanks for the update, Anjali!' }
        ],
    },
    {
        id: '3',
        author: 'Sanjay Reddy',
        timestamp: '3 days ago',
        content: 'I am planning to use drip irrigation for my sugarcane crop for the first time. Does anyone have tips on installation and maintenance? How much water does it save?',
        likes: 28,
        comments: [
             { author: 'Priya Desai', text: 'It saves a lot of water, almost 50-60%! Make sure to install filters to prevent clogging.' },
             { author: 'Ramesh Patel', text: 'Yes, filters are very important. Also, check for leaks regularly.' }
        ],
    }
];

const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const { t } = useContext(LanguageContext);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: ForumPost = {
      id: new Date().toISOString(),
      author: t('You'), // In a real app, this would be the logged-in user
      timestamp: t('Just now'),
      content: newPostContent,
      likes: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('Community Forum')}</h2>

      {/* New Post Form */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-8">
        <form onSubmit={handlePostSubmit}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder={t('Share an update or ask a question...')}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400" disabled={!newPostContent.trim()}>
              {t('Post')}
            </button>
          </div>
        </form>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white p-5 rounded-xl shadow-md">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center font-bold text-green-700 mr-3">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{post.author}</p>
                <p className="text-xs text-gray-500">{post.timestamp}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="User upload" className="rounded-lg w-full max-h-80 object-cover mb-4" />
            )}
            <div className="flex items-center space-x-4 text-gray-500 text-sm border-b pb-3 mb-3">
              <button className="hover:text-green-600">👍 {post.likes} {t('Likes')}</button>
              <button className="hover:text-green-600">💬 {post.comments.length} {t('Comments')}</button>
            </div>
            <div className="space-y-3">
              {post.comments.map((comment, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-3 text-sm">
                    {comment.author.charAt(0)}
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2 flex-1">
                    <p className="font-semibold text-sm text-gray-800">{comment.author}</p>
                    <p className="text-sm text-gray-600">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;