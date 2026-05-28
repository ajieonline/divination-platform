import React from 'react';
import { useNavigate } from 'react-router-dom';

export function VipModal({ onClose, feature }) {
  const navigate = useNavigate();

  const packages = [
    { name: '月卡', price: 29.9, period: '1个月' },
    { name: '年卡', price: 199, period: '1年' }
  ];

  const handlePurchase = async (pkg) => {
    alert(pkg.name + '购买成功！正在为您开通VIP权限...');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-purple-900 to-[#1a0a2e] rounded-2xl max-w-md w-full border border-purple-500/50 shadow-2xl shadow-purple-500/20">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👑</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">开通 VIP 会员</h2>
          <p className="text-purple-300 mb-6">解锁「{feature}」及全部 100+ 占卜功能</p>
          <div className="space-y-3 mb-6">
            {packages.map((pkg) => (
              <div key={pkg.name} onClick={() => handlePurchase(pkg)} className="p-4 bg-black/30 rounded-xl border border-purple-500/30 cursor-pointer hover:border-yellow-400/50 transition-all flex justify-between items-center group">
                <div className="text-left">
                  <div className="font-bold text-white group-hover:text-yellow-400 transition-colors">{pkg.name}</div>
                  <div className="text-xs text-gray-400">解锁全部功能 {pkg.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-yellow-400">¥{pkg.price}</div>
                  <div className="text-xs text-gray-400">{pkg.name === '月卡' ? '2.5元/月' : '约16.5元/月'}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-white transition-colors">暂时关闭</button>
        </div>
      </div>
    </div>
  );
}
