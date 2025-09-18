import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const templates = await prisma.voiceTemplate.findMany({
      where: {
        isActive: true,
        ...(category && { category })
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('获取语音模板错误:', error);
    return NextResponse.json(
      { error: '获取语音模板失败' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      displayName,
      avatar,
      description,
      category,
      defaultSpeed = 1.0,
      defaultPitch = 1.0
    } = await req.json();

    const template = await prisma.voiceTemplate.create({
      data: {
        name,
        displayName,
        avatar,
        description,
        category,
        defaultSpeed,
        defaultPitch
      }
    });

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('创建语音模板错误:', error);
    return NextResponse.json(
      { error: '创建语音模板失败' },
      { status: 500 }
    );
  }
}