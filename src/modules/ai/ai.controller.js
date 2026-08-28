
import { GoogleGenerativeAI } from '@google/generative-ai';
import { productModel } from '../../../db/modules/product.model.js';

const localAdvice = (message, products) => {
  const terms = String(message || '')
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 2);

  const ranked = [...products]
    .map((product) => {
      const text = `${product.title} ${product.description || ''} ${
        product.category || ''
      }`.toLowerCase();

      const score =
        terms.reduce(
          (score, term) => score + (text.includes(term) ? 1 : 0),
          0
        ) + (product.discountPercent ? 1 : 0);

      return { product, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ product }) => product);

  const picks = (ranked.length ? ranked : products.slice(0, 3))
    .map(
      (product) =>
        `${product.title} — $${product.price}${
          product.discountPercent
            ? ` (${product.discountPercent}% off)`
            : ''
        }`
    )
    .join('\n');

  return `Based on your request, these are the best matches in this store:\n${picks}`;
};

export const shopAssistant = async (req, res, next) => {
  try {
    const message = String(req.body?.message || '')
      .trim()
      .slice(0, 500);

    if (!message) {
      return res.status(400).json({
        message: 'Write what you are looking for',
      });
    }

    const products = await productModel
      .find({
        isVisible: { $ne: false },
        isAvailable: true,
      })
      .select(
        'title description category price discountPercent quantity'
      )
      .limit(40)
      .lean();

    // لو مفيش Gemini API Key استخدم البحث المحلي
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        answer: localAdvice(message, products),
        mode: 'smart-catalog',
      });
    }

    const catalog = products.slice(0, 30).map((product) => ({
      title: product.title,
      description: product.description || '',
      category: product.category || '',
      price: product.price,
      discountPercent: product.discountPercent || 0,
      quantity: product.quantity || 0,
    }));

    const instructions = `
You are the AI shopping assistant for this ecommerce store.

Your job:
- Understand what the customer wants.
- Recommend products ONLY from the provided catalog.
- Never invent a product.
- Never invent a price.
- Never invent stock.
- Never invent discounts.
- If no product matches, say that clearly.
- Be helpful and concise.
- Answer in the same language as the customer.
- If the customer asks for a product recommendation, explain briefly why the products fit.

Store catalog:
${JSON.stringify(catalog)}
`;

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
  systemInstruction: instructions,
});

    const result = await model.generateContent(message);

    const answer = result?.response?.text()?.trim();

    if (!answer) {
      return res.json({
        answer: localAdvice(message, products),
        mode: 'smart-catalog',
      });
    }

    return res.json({
      answer,
      mode: 'gemini',
    });
  } catch (error) {
    console.error('Shop Assistant Error:', error);

    // لو Gemini حصل فيه مشكلة، استخدم البحث المحلي
    try {
      const products = await productModel
        .find({
          isVisible: { $ne: false },
          isAvailable: true,
        })
        .select(
          'title description category price discountPercent quantity'
        )
        .limit(40)
        .lean();

      return res.json({
        answer: localAdvice(req.body?.message || '', products),
        mode: 'smart-catalog',
      });
    } catch (fallbackError) {
      next(fallbackError);
    }
  }
};
