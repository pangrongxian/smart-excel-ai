import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const celebrity = searchParams.get('celebrity');

    const where = {
      status: 'COMPLETED' as const,
      ...(celebrity && celebrity !== 'all' && { celebrity })
    };

    const [works, total] = await Promise.all([
      prisma.audioRecord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          content: true,
          celebrity: true,
          audioUrl: true,
          createdAt: true,
          playCount: true,
          downloadCount: true,
          user: {
            select: {
              username: true
            }
          }
        }
      }),
      prisma.audioRecord.count({ where })
    ]);

    // 转换数据格式以匹配前端期望的结构
    const formattedWorks = works.map(work => ({
      id: work.id,
      title: `${work.user?.username || '匿名用户'}的叫卖作品`,
      text: work.content,
      celebrity: work.celebrity,
      audioUrl: work.audioUrl,
      createdAt: work.createdAt.toISOString(),
      plays: work.playCount || 0,
      downloads: work.downloadCount || 0
    }));

    return NextResponse.json({
      success: true,
      data: {
        works: formattedWorks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch gallery works' },
      { status: 500 }
    );
  }
}