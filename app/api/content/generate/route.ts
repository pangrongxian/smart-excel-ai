import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { product, style, target } = await req.json();
    
    // 模拟生成叫卖文案的逻辑
    const mockSuggestions = [
      `新鲜${product}，${style}风味，专为${target}打造！`,
      `优质${product}大促销，${style}品质，${target}首选！`,
      `限时特价${product}，${style}口感，${target}不容错过！`
    ];

    return NextResponse.json({
      success: true,
      suggestions: mockSuggestions,
    });
  } catch (error) {
    console.error('文案生成失败:', error);
    return NextResponse.json({ error: '文案生成失败' }, { status: 500 });
  }
}