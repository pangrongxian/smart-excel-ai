"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { UserInfo } from "@/types/user";
import Link from 'next/link';
import { useState } from 'react';
import { Toaster } from "react-hot-toast";

interface HomePageProps {
  user: UserInfo | null;
}

// 明星语音数据 - 使用英文文件名避免编码问题
const celebrities = [
  { 
    id: 1, 
    name: "周杰伦", 
    avatar: "/avatars/zjl.webp", 
    voice: "温暖磁性",
    localAudio: "/voice/zhou-jielun.mp3"
  },
  { 
    id: 2, 
    name: "邓紫棋", 
    avatar: "/avatars/dzq.webp", 
    voice: "清甜动人",
    localAudio: "/voice/deng-ziqi.mp3"
  },
  { 
    id: 3, 
    name: "丁真", 
    avatar: "/avatars/dz.webp", 
    voice: "纯真自然",
    localAudio: "/voice/ding-zhen.mp3"
  },
  { 
    id: 4, 
    name: "猴哥", 
    avatar: "/avatars/swk.webp", 
    voice: "经典猴哥",
    localAudio: "/voice/hou-ge.mp3"
  },
  { 
    id: 5, 
    name: "陈奕迅", 
    avatar: "/avatars/lyx.webp", 
    voice: "情感丰富",
    localAudio: "/voice/chen-yixun.mp3"
  },
  { 
    id: 6, 
    name: "林俊杰", 
    avatar: "/avatars/ljj.webp", 
    voice: "清新自然",
    localAudio: "/voice/lin-junjie.mp3"
  },
];

// 示例叫卖文案
const sampleTexts = [
  "新鲜水果，甜过初恋！今天特价，买二送一！",
  "手工包子，现蒸现卖，香气扑鼻，快来尝尝！",
  "精品服装，款式新颖，价格实惠，走过路过不要错过！",
  "热腾腾的烤红薯，香甜软糯，冬日暖胃首选！",
  "现磨豆浆，营养丰富，香浓可口，健康首选！",
  "新鲜蔬菜，绿色有机，价格便宜，快来选购！"
];

// 全局音频实例，用于管理播放状态
let currentAudio: HTMLAudioElement | null = null;

// 播放本地预览音频 - 优化版本
const playPreviewAudio = async (celebrity: typeof celebrities[0], setLoadingAudio: (id: number | null) => void, setIsPlaying: (id: number | null) => void) => {
  try {
    // 设置加载状态
    setLoadingAudio(celebrity.id);
    setIsPlaying(null);
    
    // 停止当前播放的音频
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    // 创建新的音频实例
    const audio = new Audio();
    currentAudio = audio;
    
    // 设置音频属性
    audio.preload = 'metadata';
    audio.volume = 0.8; // 设置音量为80%
    audio.crossOrigin = 'anonymous'; // 处理跨域问题
    
    // 设置音频源
    audio.src = celebrity.localAudio;
    
    // 创建Promise来处理音频加载
    const loadAudio = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('音频加载超时'));
      }, 10000); // 10秒超时
      
      audio.addEventListener('canplaythrough', () => {
        clearTimeout(timeout);
        console.log('音频加载完成:', celebrity.localAudio);
        resolve();
      }, { once: true });
      
      audio.addEventListener('error', (e) => {
        clearTimeout(timeout);
        const error = audio.error;
        let errorMessage = '音频加载失败';
        
        if (error) {
          switch (error.code) {
            case error.MEDIA_ERR_ABORTED:
              errorMessage = '音频加载被中止';
              break;
            case error.MEDIA_ERR_NETWORK:
              errorMessage = '网络错误，请检查网络连接';
              break;
            case error.MEDIA_ERR_DECODE:
              errorMessage = '音频文件损坏或格式不支持';
              break;
            case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = '音频文件不存在或格式不支持';
              break;
            default:
              errorMessage = '未知音频错误';
        }
        }
        
        console.error('音频加载错误:', error);
        reject(new Error(errorMessage));
      }, { once: true });
      
      // 开始加载音频
      audio.load();
    });
    
    // 等待音频加载完成
    await loadAudio;
    
    // 清除加载状态
    setLoadingAudio(null);
    
    // 播放音频
    try {
      await audio.play();
      console.log('音频播放成功:', celebrity.name);
      
      // 设置播放状态
      setIsPlaying(celebrity.id);
      
      // 播放结束后清理
      audio.addEventListener('ended', () => {
        if (currentAudio === audio) {
          currentAudio = null;
          setIsPlaying(null);
        }
      }, { once: true });
      
      // 播放暂停时清理状态
      audio.addEventListener('pause', () => {
        if (currentAudio === audio) {
          setIsPlaying(null);
        }
      }, { once: true });
      
    } catch (playError) {
      console.error('播放失败:', playError);
      setIsPlaying(null);
      
      // 处理自动播放策略错误
      if (playError instanceof Error) {
        if (playError.name === 'NotAllowedError') {
          alert('浏览器阻止了自动播放，请点击页面任意位置后再试');
        } else if (playError.name === 'NotSupportedError') {
          alert('您的浏览器不支持此音频格式');
        } else {
          alert(`播放失败: ${playError.message}`);
        }
      }
      
      // 清理音频实例
      if (currentAudio === audio) {
        currentAudio = null;
      }
    }
    
  } catch (error) {
    console.error('音频播放失败:', error);
    
    // 清除加载和播放状态
    setLoadingAudio(null);
    setIsPlaying(null);
    
    if (error instanceof Error) {
      if (error.message.includes('超时')) {
        alert('音频加载超时，请检查网络连接或稍后重试');
      } else {
        alert(`播放失败: ${error.message}\n\n建议:\n1. 刷新页面重试\n2. 检查网络连接\n3. 尝试其他浏览器`);
      }
    } else {
      alert('播放失败: 未知错误');
    }
    
    // 清理音频实例
    if (currentAudio) {
      currentAudio = null;
    }
  }
};

export default function HomePage({ user }: HomePageProps) {
  const { locale } = useLanguage();
  const [selectedCelebrity, setSelectedCelebrity] = useState(celebrities[0]);
  const [inputText, setInputText] = useState("");
  const [currentSample, setCurrentSample] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [useLocalAudio, setUseLocalAudio] = useState(true);
  const [isPlaying, setIsPlaying] = useState<number | null>(null); // 记录正在播放的明星ID
  const [loadingAudio, setLoadingAudio] = useState<number | null>(null); // 记录正在加载的明星ID

  // 切换示例文案
  const nextSample = () => {
    setCurrentSample((prev) => (prev + 1) % sampleTexts.length);
    setInputText(sampleTexts[(currentSample + 1) % sampleTexts.length]);
  };

  // 生成语音 - 优化错误处理和用户体验
  const generateVoice = async () => {
    if (!inputText.trim()) {
      alert("请输入叫卖文案");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // 优先使用本地音频文件
      if (useLocalAudio && selectedCelebrity.localAudio) {
        // 模拟生成过程
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 验证音频文件是否存在并可以播放
        const testAudio = new Audio();
        
        const audioLoadPromise = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('音频加载超时'));
          }, 5000);
          
          testAudio.addEventListener('canplaythrough', () => {
            clearTimeout(timeout);
            resolve(true);
          });
          
          testAudio.addEventListener('error', (e) => {
            clearTimeout(timeout);
            reject(new Error(`音频文件不存在或格式不支持: ${selectedCelebrity.localAudio}`));
          });
          
          testAudio.src = selectedCelebrity.localAudio;
          testAudio.load();
        });
        
        await audioLoadPromise;
        setAudioUrl(selectedCelebrity.localAudio);
        console.log('使用本地音频文件:', selectedCelebrity.localAudio);
        
      } else {
        // 备用：调用API生成
        const response = await fetch('/api/voice/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: inputText,
            celebrityId: selectedCelebrity.id,
            celebrityName: selectedCelebrity.name,
            userId: user?.userId
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          setAudioUrl(data.audioUrl);
          console.log('API生成成功:', data.message);
        } else {
          const errorData = await response.json();
          console.error('API错误:', errorData);
          
          // 如果API失败，尝试回退到本地音频
          if (selectedCelebrity.localAudio) {
            try {
              const testAudio = new Audio(selectedCelebrity.localAudio);
              await new Promise((resolve, reject) => {
                testAudio.addEventListener('canplaythrough', resolve);
                testAudio.addEventListener('error', reject);
                testAudio.load();
              });
              setAudioUrl(selectedCelebrity.localAudio);
              console.log('API失败，回退到本地音频:', selectedCelebrity.localAudio);
            } catch (localError) {
              alert(`生成失败：${errorData.error || '请稍后重试'}\n本地音频也无法加载`);
            }
          } else {
            alert(`生成失败：${errorData.error || '请稍后重试'}`);
          }
        }
      }
    } catch (error) {
      console.error("生成语音失败:", error);
      alert(`生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-8 bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Hero区域 */}
      <div className="text-center mb-12 max-w-4xl">
        <h1 className="sm:text-6xl text-4xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI明星叫卖神器
        </h1>
        <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed">
          一键生成明星语音叫卖，地道口吻、循环播放<br/>
          夜市摊主、小店老板、路边摊都能立刻用起来
        </p>
        
        {/* 动态切换的示例预览 */}
        <div className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img 
              src={selectedCelebrity.avatar} 
              alt={selectedCelebrity.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
              onError={(e) => {
                console.error('头像加载失败:', selectedCelebrity.avatar);
                e.currentTarget.src = '/logo.png'; // 使用默认图片作为后备
              }}
            />
            <div className="text-left">
              <p className="text-sm text-gray-500">正在播放示例</p>
              <p className="font-medium text-gray-800">{selectedCelebrity.name} · {selectedCelebrity.voice}</p>
            </div>
            <button 
              onClick={() => playPreviewAudio(selectedCelebrity, setLoadingAudio, setIsPlaying)}
              className="bg-purple-100 hover:bg-purple-200 text-purple-600 p-2 rounded-full transition-colors"
              title="试听语音"
            >
              {loadingAudio === selectedCelebrity.id ? (
                <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying === selectedCelebrity.id ? (
                '⏸️'
              ) : (
                '🎵'
              )}
            </button>
          </div>
          <p className="text-gray-700 italic">"{sampleTexts[currentSample]}"</p>
          <button 
            onClick={nextSample}
            className="mt-3 text-sm text-purple-600 hover:text-purple-800 transition-colors"
          >
            🔄 换个示例听听
          </button>
        </div>
      </div>

      {/* 模式切换 */}
      <div className="w-full max-w-4xl mb-6">
        <div className="flex justify-center items-center space-x-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
          <span className="text-gray-700 font-medium">生成模式：</span>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              checked={useLocalAudio}
              onChange={() => setUseLocalAudio(true)}
              className="text-purple-600"
            />
            <span className="text-sm">本地音频（快速）</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              checked={!useLocalAudio}
              onChange={() => setUseLocalAudio(false)}
              className="text-purple-600"
            />
            <span className="text-sm">AI生成（定制）</span>
          </label>
        </div>
      </div>

      {/* 明星选择区域 */}
      <div className="w-full max-w-6xl mb-8">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">选择明星语音</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {celebrities.map((celebrity) => (
            <div
              key={celebrity.id}
              onClick={() => setSelectedCelebrity(celebrity)}
              className={`cursor-pointer p-4 rounded-2xl transition-all duration-300 ${
                selectedCelebrity.id === celebrity.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white/80 hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <img 
                  src={celebrity.avatar} 
                  alt={celebrity.name}
                  className="w-16 h-16 mx-auto mb-3 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    console.error('头像加载失败:', celebrity.avatar);
                    e.currentTarget.src = '/logo.png'; // 使用默认图片作为后备
                  }}
                />
                <p className="font-medium text-sm">{celebrity.name}</p>
                <p className="text-xs opacity-75 mt-1">{celebrity.voice}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    playPreviewAudio(celebrity, setLoadingAudio, setIsPlaying);
                  }}
                  className={`mt-2 text-xs px-2 py-1 rounded-full transition-colors ${
                    selectedCelebrity.id === celebrity.id
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                  }`}
                  disabled={loadingAudio === celebrity.id}
                >
                  {loadingAudio === celebrity.id ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block"></div>
                  ) : isPlaying === celebrity.id ? (
                    '⏸️ 播放中'
                  ) : (
                    '🎵 试听'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 文案输入区域 */}
      <div className="w-full max-w-4xl mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">输入叫卖文案</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="输入您的叫卖文案，比如：新鲜水果，甜过初恋！今天特价，买二送一！"
            className="w-full h-32 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">{inputText.length}/200 字符</span>
            <button
              onClick={generateVoice}
              disabled={isGenerating || !inputText.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{useLocalAudio ? '加载中...' : '生成中...'}</span>
                </span>
              ) : (
                `🎵 ${useLocalAudio ? '使用本地语音' : '生成叫卖语音'}`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 音频播放区域 */}
      {audioUrl && (
        <div className="w-full max-w-4xl mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">生成的叫卖语音</h3>
            <div className="flex items-center space-x-4">
              <audio 
                controls 
                loop 
                className="flex-1" 
                key={audioUrl}
                preload="metadata"
                onError={(e) => {
                  console.error('音频播放器错误:', e);
                  const target = e.target as HTMLAudioElement;
                  const error = target.error;
                  
                  let errorMessage = '音频播放失败';
                  if (error) {
                    switch (error.code) {
                      case error.MEDIA_ERR_ABORTED:
                        errorMessage = '音频播放被中止';
                        break;
                      case error.MEDIA_ERR_NETWORK:
                        errorMessage = '网络错误';
                        break;
                      case error.MEDIA_ERR_DECODE:
                        errorMessage = '音频解码错误';
                        break;
                      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMessage = '音频格式不支持';
                        break;
                    }
                  }
                  
                  alert(`${errorMessage}\n\n解决方案:\n1. 检查网络连接\n2. 刷新页面重试\n3. 下载文件到本地播放`);
                }}
                onLoadStart={() => console.log('开始加载音频:', audioUrl)}
                onCanPlay={() => console.log('音频可以播放')}
                onLoadedData={() => console.log('音频数据加载完成')}
              >
                <source src={audioUrl} type="audio/mpeg" />
                <source src={audioUrl} type="audio/mp3" />
                <source src={audioUrl} type="audio/wav" />
                您的浏览器不支持音频播放。请尝试使用现代浏览器如 Chrome、Firefox 或 Safari。
              </audio>
              <a
                href={audioUrl}
                download={`${selectedCelebrity.name}_叫卖语音.mp3`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                📥 下载
              </a>
            </div>
            <div className="mt-3 text-sm text-gray-500">
              <p>明星语音：{selectedCelebrity.name} · {selectedCelebrity.voice}</p>
              <p>文案内容：{inputText}</p>
              <p>音频来源：{useLocalAudio ? '本地音频文件' : 'AI生成'}</p>
              <p>文件路径：{audioUrl}</p>
            </div>
          </div>
        </div>
      )}

      {/* 功能特点 */}
      <div className="w-full max-w-6xl mb-12">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">为什么选择我们？</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl">
              🎭
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">明星级语音</h3>
            <p className="text-gray-600">精选热门明星语音，地道口吻，让您的叫卖更有吸引力</p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">一键生成</h3>
            <p className="text-gray-600">输入文案，选择明星，一键生成专业叫卖语音，简单快捷</p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl">
              🔄
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">循环播放</h3>
            <p className="text-gray-600">支持循环播放和下载，适合各种线下场景使用</p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl">
              💾
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">本地优先</h3>
            <p className="text-gray-600">本地音频文件，无需网络，快速响应，稳定可靠</p>
          </div>
        </div>
      </div>

      {/* 用户登录提示 */}
      {!user && (
        <div className="text-center mb-8">
          <p className="text-lg text-gray-700 mb-6">
            登录后享受更多功能和免费额度
          </p>
          <Link href={`/${locale}/login`} legacyBehavior>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium px-8 py-4 rounded-xl hover:shadow-lg transition-all duration-300">
              立即登录 →
            </button>
          </Link>
        </div>
      )}

      {/* Toast 通知 */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 3000 }}
      />
    </div>
  );
}
