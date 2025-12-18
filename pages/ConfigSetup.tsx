import React from 'react';
import { Navigate } from 'react-router-dom';

const ConfigSetup: React.FC = () => {
  // 直接導向首頁，因為配置現在已經寫在程式碼裡了
  return <Navigate to="/" replace />;
};

export default ConfigSetup;