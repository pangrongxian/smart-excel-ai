import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { product, style, target } = await req.json();
    
    const prompt = `
作为一个专业的叫卖文案生成器，请为以下产品生成地道的叫卖词：

产品：${product}
风格：${style}
目标客户：${target}

要求：
1. 语言生动有趣，朗朗上口
2. 突出产品特色和优势
3. 适合循环播放
4. 长度控制在30-60字
5. 体现地道的叫卖口吻

请生成3个不同风格的叫卖文案：
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || '';
    const suggestions = content.split('\n').filter(line => line.trim());

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('文案生成失败:', error);
    return NextResponse.json({ error: '文案生成失败' }, { status: 500 });
  }
}