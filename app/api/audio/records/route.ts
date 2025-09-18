import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户的音频记录
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const where = {
      ...(userId && { userId }),
      ...(status && { status: status as any })
    };

    const [records, total] = await Promise.all([
      prisma.audioRecord.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              username: true,
              avatar: true
            }
          }
        }
      }),
      prisma.audioRecord.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        records,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('获取音频记录错误:', error);
    return NextResponse.json(
      { error: '获取音频记录失败' },
      { status: 500 }
    );
  }
}