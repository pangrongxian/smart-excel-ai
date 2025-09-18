import { PrismaClient } from '@prisma/client';
import AudioPlayer from '@/components/audio/AudioPlayer';

const prisma = new PrismaClient();

export default async function GalleryPage() {
  const publicAudios = await prisma.audioRecord.findMany({
    where: { 
      status: 'COMPLETED'
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎵 精彩叫卖作品展示
          </h1>
          <p className="text-xl text-gray-600">
            听听其他摊主们的创意叫卖，找找灵感！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publicAudios.map((audio) => (
            <div key={audio.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">叫卖内容</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">
                  {audio.content}
                </p>
              </div>
              
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {audio.celebrity}
                </span>
              </div>

              {audio.audioUrl && (
                <AudioPlayer
                  src={audio.audioUrl}
                  title="叫卖音频"
                  celebrity={audio.celebrity}
                  onDownload={() => {
                    const link = document.createElement('a');
                    link.href = audio.audioUrl!;
                    link.download = `${audio.celebrity}-叫卖.mp3`;
                    link.click();
                  }}
                />
              )}
              
              <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                <span>播放次数: {audio.playCount || 0}</span>
                <span>下载次数: {audio.downloadCount || 0}</span>
              </div>
            </div>
          ))}
        </div>

        {publicAudios.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无作品</h3>
            <p className="text-gray-600">还没有人创建作品</p>
          </div>
        )}
      </div>
    </div>
  );
}