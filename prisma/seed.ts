import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 创建默认的语音模板
  const voiceTemplates = [
    {
      name: 'guodegang',
      displayName: '郭德纲',
      avatar: '/images/voices/guodegang.jpg',
      description: '相声大师，幽默风趣，适合各种商品叫卖',
      category: '相声演员',
      defaultSpeed: 1.0,
      defaultPitch: 1.0,
      sortOrder: 1
    },
    {
      name: 'zhaobenshan',
      displayName: '赵本山',
      avatar: '/images/voices/zhaobenshan.jpg',
      description: '小品王，东北味十足，亲切自然',
      category: '小品演员',
      defaultSpeed: 0.9,
      defaultPitch: 1.1,
      sortOrder: 2
    },
    {
      name: 'xiaoshenyang',
      displayName: '小沈阳',
      avatar: '/images/voices/xiaoshenyang.jpg',
      description: '搞笑天王，声音独特，吸引眼球',
      category: '小品演员',
      defaultSpeed: 1.1,
      defaultPitch: 1.2,
      sortOrder: 3
    },
    {
      name: 'songxiaobao',
      displayName: '宋小宝',
      avatar: '/images/voices/songxiaobao.jpg',
      description: '喜剧明星，声音憨厚，亲民接地气',
      category: '小品演员',
      defaultSpeed: 0.8,
      defaultPitch: 0.9,
      sortOrder: 4
    },
    {
      name: 'yueyunpeng',
      displayName: '岳云鹏',
      avatar: '/images/voices/yueyunpeng.jpg',
      description: '德云社当红演员，声音清亮，年轻活力',
      category: '相声演员',
      defaultSpeed: 1.0,
      defaultPitch: 1.0,
      sortOrder: 5
    }
  ];

  for (const template of voiceTemplates) {
    await prisma.voiceTemplate.upsert({
      where: { name: template.name },
      update: template,
      create: template
    });
  }

  console.log('数据库种子数据创建完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });