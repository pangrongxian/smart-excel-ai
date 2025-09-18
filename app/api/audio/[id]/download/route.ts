import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 增加下载次数
    const record = await prisma.audioRecord.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        downloadCount: record.downloadCount,
        audioUrl: record.audioUrl
      }
    });

  } catch (error) {
    console.error('更新下载统计错误:', error);
    return NextResponse.json(
      { error: '更新下载统计失败' },
      { status: 500 }
    );
  }
}