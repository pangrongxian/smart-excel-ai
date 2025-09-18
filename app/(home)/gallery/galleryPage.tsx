"use client";

import { useState, useEffect } from 'react';
import { UserInfo } from "@/types/user";
import AudioPlayer from "@/components/audio/AudioPlayer";

interface AudioWork {
  id: string;
  title: string;
  text: string;
  celebrity: string;
  audioUrl: string;
  createdAt: string;
  plays: number;
  likes: number;
}

interface GalleryPageProps {
  user: UserInfo | null;
}

export default function GalleryPage({ user }: GalleryPageProps) {
  const [works, setWorks] = useState<AudioWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/gallery/works');
      if (response.ok) {
        const data = await response.json();
        setWorks(data.works);
      }
    } catch (error) {
      console.error('获取作品失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const celebrities = ['全部', '周杰伦', '邓紫棋', '刘德华', '王菲', '陈奕迅', '林俊杰'];

  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(work => work.celebrity === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            叫卖语音作品集
          </h1>
          <p className="text-slate-600 text-lg">
            发现更多精彩的AI生成叫卖语音作品
          </p>
        </div>

        {/* 筛选器 */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {celebrities.map((celebrity) => (
              <button
                key={celebrity}
                onClick={() => setFilter(celebrity === '全部' ? 'all' : celebrity)}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  (filter === 'all' && celebrity === '全部') || filter === celebrity
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
                }`}
              >
                {celebrity}
              </button>
            ))}
          </div>
        </div>

        {/* 作品网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <div key={work.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">{work.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">"{work.text}"</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{work.celebrity}</span>
                  <span>{new Date(work.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <AudioPlayer
                src={work.audioUrl}
                title={work.title}
                celebrity={work.celebrity}
                onDownload={() => {
                  const link = document.createElement('a');
                  link.href = work.audioUrl;
                  link.download = `${work.title}.mp3`;
                  link.click();
                }}
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <span>▶️</span>
                    <span>{work.plays}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span>{work.likes}</span>
                  </span>
                </div>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                  分享
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无作品</h3>
            <p className="text-gray-600">
              {filter === 'all' ? '还没有人创建作品' : `暂无${filter}的作品`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}