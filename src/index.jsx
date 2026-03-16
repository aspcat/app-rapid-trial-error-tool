import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import App from './App';
import './index.less';

const STORAGE_NAMESPACE = '__appRapidTrialErrorTool__';

const readWindowNameStore = () => {
  try {
    const parsed = JSON.parse(window.name || '{}');
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
};

const writeWindowNameStore = (store) => {
  try {
    window.name = JSON.stringify(store);
  } catch {
    return;
  }
};

const getFallbackItem = (key) => {
  const store = readWindowNameStore();
  const bucket = store[STORAGE_NAMESPACE];
  if (!bucket || typeof bucket !== 'object') return null;
  return Object.prototype.hasOwnProperty.call(bucket, key) ? bucket[key] : null;
};

const setFallbackItem = (key, value) => {
  const store = readWindowNameStore();
  const bucket = store[STORAGE_NAMESPACE];
  const nextBucket = bucket && typeof bucket === 'object' ? bucket : {};
  nextBucket[key] = String(value);
  store[STORAGE_NAMESPACE] = nextBucket;
  writeWindowNameStore(store);
};

if (!window.__appStoragePatched) {
  const originalGetItem = Storage.prototype.getItem;
  const originalSetItem = Storage.prototype.setItem;

  Storage.prototype.getItem = function patchedGetItem(key) {
    if (this === window.localStorage) {
      try {
        return originalGetItem.call(this, key);
      } catch {
        return getFallbackItem(key);
      }
    }
    return originalGetItem.call(this, key);
  };

  Storage.prototype.setItem = function patchedSetItem(key, value) {
    if (this === window.localStorage) {
      try {
        return originalSetItem.call(this, key, value);
      } catch {
        setFallbackItem(key, value);
        return;
      }
    }
    return originalSetItem.call(this, key, value);
  };

  window.__appStoragePatched = true;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
