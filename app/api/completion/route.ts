import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  // 判断referer
  // Check the referer
  const headers = req.headers
  const referer: string | null = headers.get('referer')

  // 判断token是否存在
  // Verify if token exists
  const token = headers.get('token')

  const { language, prompt } = await req.json();
}

