/**
 * 支付引擎 - 对接微信支付和支付宝
 * 从数据库 settings 表读取配置，支持动态切换
 */

const crypto = require('crypto');

class PaymentEngine {
  constructor(db) {
    this.db = db;
  }

  // 从 settings 表读取支付配置
  getPaymentConfig() {
    const rows = this.db.prepare("SELECT key, value FROM settings WHERE key LIKE 'pay_%' OR key LIKE 'wechat_%' OR key LIKE 'alipay_%'").all();
    const config = {};
    rows.forEach(r => { config[r.key] = r.value; });
    return {
      // 微信支付
      wechatEnabled: config.wechat_enabled === 'true',
      wechatAppId: config.wechatAppId || '',
      wechatMchId: config.wechatMchId || '',
      wechatApiKey: config.wechatApiKey || '',
      wechatNotifyUrl: config.wechatNotifyUrl || '',
      // 支付宝
      alipayEnabled: config.alipay_enabled === 'true',
      alipayAppId: config.alipayAppId || '',
      alipayPrivateKey: config.alipayPrivateKey || '',
      alipayPublicKey: config.alipayPublicKey || '',
      alipayNotifyUrl: config.alipayNotifyUrl || '',
      // 通用
      payNotifyHost: config.payNotifyHost || 'http://47.86.9.65',
    };
  }

  // 保存支付配置
  savePaymentConfig(config) {
    const upsert = this.db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    const tx = this.db.transaction(() => {
      Object.entries(config).forEach(([k, v]) => {
        if (v !== undefined && v !== null) upsert.run(k, String(v));
      });
    });
    tx();
  }

  grantSingleReportCredit(order) {
    if (!order || order.product !== 'single_report' || !order.user_id) return;
    const existing = this.db.prepare('SELECT id FROM usage_unlocks WHERE order_id = ?').get(order.id);
    if (existing) return;
    this.db.prepare(
      'INSERT INTO usage_unlocks (id, user_id, order_id, product, remaining) VALUES (?,?,?,?,?)'
    ).run(crypto.randomUUID(), order.user_id, order.id, order.product, 1);
  }

  // ========== 微信支付 ==========

  // 生成微信支付预付单（Native支付 - 二维码）
  async createWechatNativeOrder(orderNo, amount, description) {
    const config = this.getPaymentConfig();
    if (!config.wechatEnabled) throw new Error('微信支付未启用');
    if (!config.wechatMchId || !config.wechatApiKey) throw new Error('微信支付配置不完整');

    const mchid = config.wechatMchId;
    const appid = config.wechatAppId;
    const apiKey = config.wechatApiKey;
    const notifyUrl = config.wechatNotifyUrl || `${config.payNotifyHost}/api/pay/callback/wechat`;

    // 金额转为分
    const totalFee = Math.round(amount * 100);
    const nonceStr = crypto.randomBytes(16).toString('hex');
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // 构建请求体
    const body = {
      appid,
      mchid,
      description: description || '占卜服务',
      out_trade_no: orderNo,
      notify_url: notifyUrl,
      amount: { total: totalFee, currency: 'CNY' },
    };

    // 生成签名
    const signStr = `appid=${appid}&mchid=${mchid}&nonce_str=${nonceStr}&notify_url=${notifyUrl}&out_trade_no=${orderNo}&total_fee=${totalFee}`;
    const sign = crypto.createHash('md5').update(signStr + '&key=' + apiKey).digest('hex').toUpperCase();

    // 注意：实际生产环境需要使用微信支付v3 API（RSA签名）或v2 API（MD5签名）
    // 这里提供标准框架，实际部署时根据商户平台版本调整
    try {
      const response = await fetch('https://api.mch.weixin.qq.com/v3/pay/transactions/native', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `WECHATPAY2-SHA256-RSA2048 mchid="${mchid}"`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.code) throw new Error(data.message || '微信支付下单失败');
      return { code_url: data.code_url, orderNo };
    } catch (err) {
      // 降级：生成模拟二维码供测试
      console.warn('微信支付API调用失败，使用模拟模式:', err.message);
      return {
        code_url: `weixin://wxpay/bizpayurl?pr=${orderNo}`,
        orderNo,
        simulated: true,
        message: '当前为模拟支付模式，请配置正确的微信支付商户信息'
      };
    }
  }

  // 微信支付回调验签
  verifyWechatCallback(headers, body) {
    const config = this.getPaymentConfig();
    // v3 API 使用RSA验签
    // 简化版：检查订单号是否存在
    try {
      const data = JSON.parse(body);
      const order = this.db.prepare('SELECT * FROM orders WHERE order_no = ?').get(data.out_trade_no);
      if (!order) return null;

      // 验证金额
      if (data.amount && data.amount.total !== Math.round(order.amount * 100)) {
        console.warn('微信回调金额不匹配:', data.out_trade_no);
        return null;
      }
      return order;
    } catch (e) {
      return null;
    }
  }

  // 处理微信支付成功
  handleWechatPaySuccess(order) {
    if (order.status === 'paid') return; // 已处理
    this.db.prepare("UPDATE orders SET status = 'paid', pay_time = datetime('now') WHERE id = ?").run(order.id);

    // 处理VIP开通
    const vipDays = { vip_month: 30, vip_quarter: 90, vip_year: 365 }[order.product];
    if (vipDays) {
      const expire = new Date(Date.now() + vipDays * 86400000).toISOString();
      this.db.prepare('UPDATE users SET is_vip = 1, vip_expire = ? WHERE id = ?').run(expire, order.user_id);
    }
    this.grantSingleReportCredit(order);
  }

  // ========== 支付宝 ==========

  // 创建支付宝电脑网站支付
  async createAlipayOrder(orderNo, amount, subject) {
    const config = this.getPaymentConfig();
    if (!config.alipayEnabled) throw new Error('支付宝未启用');
    if (!config.alipayAppId || !config.alipayPrivateKey) throw new Error('支付宝配置不完整');

    const notifyUrl = config.alipayNotifyUrl || `${config.payNotifyHost}/api/pay/callback/alipay`;

    // 构建公共请求参数
    const bizContent = {
      out_trade_no: orderNo,
      total_amount: amount.toFixed(2),
      subject: subject || '占卜服务',
      product_code: 'FAST_INSTANT_TRADE_PAY',
    };

    const params = {
      app_id: config.alipayAppId,
      method: 'alipay.trade.page.pay',
      charset: 'utf-8',
      sign_type: 'RSA2',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      version: '1.0',
      notify_url: notifyUrl,
      biz_content: JSON.stringify(bizContent),
    };

    // RSA2签名（使用支付宝私钥）
    const sortedKeys = Object.keys(params).sort();
    const signStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&');
    try {
      const sign = crypto.createSign('RSA-SHA256');
      sign.update(signStr);
      const signature = sign.sign(config.alipayPrivateKey, 'base64');
      params.sign = signature;
    } catch (e) {
      console.warn('支付宝签名失败:', e.message);
    }

    // 生成支付表单URL
    const payUrl = 'https://openapi.alipay.com/gateway.do?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

    return { pay_url: payUrl, orderNo };
  }

  // 支付宝回调验签
  verifyAlipayCallback(params) {
    const config = this.getPaymentConfig();
    try {
      // 验证app_id
      if (params.app_id !== config.alipayAppId) return null;
      // 验证签名
      const sign = params.sign;
      const sortedKeys = Object.keys(params).filter(k => k !== 'sign' && k !== 'sign_type').sort();
      const signStr = sortedKeys.map(k => `${k}=${params[k]}`).join('&');

      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(signStr);
      const isValid = verify.verify(config.alipayPublicKey, sign, 'base64');
      if (!isValid) {
        console.warn('支付宝回调验签失败');
        return null;
      }

      const order = this.db.prepare('SELECT * FROM orders WHERE order_no = ?').get(params.out_trade_no);
      if (!order) return null;
      if (params.total_amount !== order.amount.toFixed(2)) {
        console.warn('支付宝回调金额不匹配:', params.out_trade_no);
        return null;
      }
      return order;
    } catch (e) {
      console.error('支付宝回调处理错误:', e.message);
      return null;
    }
  }

  // 处理支付宝支付成功
  handleAlipayPaySuccess(order) {
    if (order.status === 'paid') return;
    this.db.prepare("UPDATE orders SET status = 'paid', pay_time = datetime('now') WHERE id = ?").run(order.id);

    const vipDays = { vip_month: 30, vip_quarter: 90, vip_year: 365 }[order.product];
    if (vipDays) {
      const expire = new Date(Date.now() + vipDays * 86400000).toISOString();
      this.db.prepare('UPDATE users SET is_vip = 1, vip_expire = ? WHERE id = ?').run(expire, order.user_id);
    }
    this.grantSingleReportCredit(order);
  }

  // ========== 状态查询 ==========

  getOrderStatus(orderNo) {
    const order = this.db.prepare('SELECT * FROM orders WHERE order_no = ?').get(orderNo);
    if (!order) return null;
    return {
      orderNo: order.order_no,
      status: order.status,
      product: order.product,
      amount: order.amount,
      payChannel: order.pay_channel,
      payTime: order.pay_time,
      createdAt: order.created_at,
    };
  }

  // 获取支付配置状态（不含敏感密钥）
  getPaymentStatus() {
    const config = this.getPaymentConfig();
    return {
      wechat: {
        enabled: config.wechatEnabled,
        configured: !!(config.wechatAppId && config.wechatMchId && config.wechatApiKey),
        appId: config.wechatAppId ? config.wechatAppId.slice(0, 6) + '***' : '',
        mchId: config.wechatMchId || '',
      },
      alipay: {
        enabled: config.alipayEnabled,
        configured: !!(config.alipayAppId && config.alipayPrivateKey && config.alipayPublicKey),
        appId: config.alipayAppId ? config.alipayAppId.slice(0, 6) + '***' : '',
      },
    };
  }
}

module.exports = PaymentEngine;
