import { NextRequest, NextResponse } from 'next/server';

// 叫卖文案模板
const SALES_TEMPLATES = {
  food: [
    "新鲜{product}，{feature}！今天特价，{promotion}！",
    "热腾腾的{product}，{feature}，{season}首选！",
    "现做现卖的{product}，{feature}，快来尝尝！",
    "正宗{product}，{feature}，老字号品质！"
  ],
  clothing: [
    "精品{product}，{feature}，{promotion}！",
    "时尚{product}，{feature}，走过路过不要错过！",
    "品牌{product}，{feature}，限时特惠！",
    "新款{product}，{feature}，穿出你的风采！"
  ],
  electronics: [
    "正品{product}，{feature}，{promotion}！",
    "高品质{product}，{feature}，性价比超高！",
    "最新{product}，{feature}，现货充足！",
    "原装{product}，{feature}，质量保证！"
  ],
  general: [
    "优质{product}，{feature}，{promotion}！",
    "精选{product}，{feature}，机会难得！",
    "特价{product}，{feature}，数量有限！",
    "好货{product}，{feature}，不容错过！"
  ]
};

const FEATURES = [
  "香甜可口", "新鲜美味", "营养丰富", "口感绝佳",
  "款式新颖", "质量上乘", "价格实惠", "物美价廉",
  "功能强大", "操作简单", "经久耐用", "性能卓越"
];

const PROMOTIONS = [
  "买二送一", "第二件半价", "满100减20", "限时8折",
  "买三免一", "充100送20", "新客9折", "老客户优惠"
];

const SEASONS = {
  spring: ["春日", "踏青", "春季"],
  summer: ["夏日", "消暑", "夏季"],
  autumn: ["秋日", "进补", "秋季"],
  winter: ["冬日", "暖胃", "冬季"]
};

export async function POST(request: NextRequest) {
  try {
    const { product, category = 'general', style = 'enthusiastic' } = await request.json();

    if (!product) {
      return NextResponse.json(
        { error: '请提供产品名称' },
        { status: 400 }
      );
    }

    // 根据分类选择模板
    const templates = SALES_TEMPLATES[category as keyof typeof SALES_TEMPLATES] || SALES_TEMPLATES.general;
    
    // 随机选择模板和特征
    const template = templates[Math.floor(Math.random() * templates.length)];
    const feature = FEATURES[Math.floor(Math.random() * FEATURES.length)];
    const promotion = PROMOTIONS[Math.floor(Math.random() * PROMOTIONS.length)];
    
    // 获取当前季节
    const month = new Date().getMonth();
    let season = 'spring';
    if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else if (month >= 11 || month <= 1) season = 'winter';
    
    const seasonWord = SEASONS[season as keyof typeof SEASONS][Math.floor(Math.random() * 3)];

    // 生成文案
    let generatedText = template
      .replace('{product}', product)
      .replace('{feature}', feature)
      .replace('{promotion}', promotion)
      .replace('{season}', seasonWord);

    // 根据风格调整
    if (style === 'gentle') {
      generatedText = generatedText.replace(/！/g, '~');
    } else if (style === 'urgent') {
      generatedText += ' 快快快，售完即止！';
    }

    // 生成多个备选方案
    const alternatives = [];
    for (let i = 0; i < 3; i++) {
      const altTemplate = templates[Math.floor(Math.random() * templates.length)];
      const altFeature = FEATURES[Math.floor(Math.random() * FEATURES.length)];
      const altPromotion = PROMOTIONS[Math.floor(Math.random() * PROMOTIONS.length)];
      
      let altText = altTemplate
        .replace('{product}', product)
        .replace('{feature}', altFeature)
        .replace('{promotion}', altPromotion)
        .replace('{season}', seasonWord);
        
      if (style === 'gentle') {
        altText = altText.replace(/！/g, '~');
      } else if (style === 'urgent') {
        altText += ' 机不可失！';
      }
      
      alternatives.push(altText);
    }

    return NextResponse.json({
      success: true,
      text: generatedText,
      alternatives: alternatives,
      product: product,
      category: category,
      style: style
    });

  } catch (error) {
    console.error('文案生成失败:', error);
    return NextResponse.json(
      { error: '文案生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}