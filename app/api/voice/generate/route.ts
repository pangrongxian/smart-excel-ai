import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  console.log('=== 语音生成API调用开始 ===');
  
  try {
    const { text, celebrityId, celebrityName, userId } = await req.json();
    
    console.log('请求参数:', { text, celebrityId, celebrityName, userId });

    if (!text || !celebrityName) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 检查API密钥
    const apiKey = process.env.FISH_AUDIO_API_KEY;
    if (!apiKey) {
      console.error('Fish Audio API密钥未配置');
      return NextResponse.json({ error: 'API密钥未配置' }, { status: 500 });
    }
    
    console.log('API密钥检查: 已配置');

    // 生成语音
    const audioUrl = await generateRealAudio(text, celebrityName, apiKey);
    
    return NextResponse.json({
      success: true,
      audioUrl: audioUrl,
      message: '语音生成成功'
    });

  } catch (error) {
    console.error('语音生成失败:', error);
    return NextResponse.json(
      { 
        error: '语音生成失败', 
        details: error instanceof Error ? error.message : '未知错误' 
      }, 
      { status: 500 }
    );
  }
}

async function generateRealAudio(text: string, celebrityName: string, apiKey: string): Promise<string> {
  console.log('开始调用Fish Audio API...');
  console.log(`为明星 ${celebrityName} 生成语音: "${text}"`);

  try {
    // 根据官方文档的标准API调用格式
    const requestBody = {
      text: text,
      format: "mp3"
    };
    
    console.log('Fish Audio API请求体:', JSON.stringify(requestBody, null, 2));

    // 使用官方文档中的正确端点和请求头格式
    const response = await fetch('https://api.fish.audio/v1/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'model': 's1'  // 根据官方文档添加model头
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Fish Audio API响应状态:', response.status);
    console.log('Fish Audio API响应头:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Fish Audio API错误响应:', errorText);
      throw new Error(`Fish Audio API错误: ${response.status} - ${errorText}`);
    }

    // 处理音频响应 - 直接返回音频数据
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');
    const audioDataUrl = `data:audio/mpeg;base64,${base64Audio}`;
    
    console.log('语音生成成功，Base64长度:', base64Audio.length);
    return audioDataUrl;

  } catch (error) {
    console.error('Fish Audio API调用失败:', error);
    throw new Error(`语音生成失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}