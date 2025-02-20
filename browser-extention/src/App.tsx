/// <reference types="chrome"/>
/// <reference types="firefox-webext-browser"/>

import { useEffect, useState } from 'react';
import { List, Card, Typography, Spin } from 'antd';
import { ImageProps } from './types';
import './App.css';

const { Title } = Typography;

// Add browser compatibility helper
const browserAPI = typeof chrome !== 'undefined' ? chrome : browser;

function App() {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentTab = async () => {
      const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
      if (tab.id) {
        browserAPI.tabs.sendMessage(
          tab.id,
          { type: 'GET_IMAGES' },
          (response: ImageProps[]) => {
            setImages(response);
            setLoading(false);
          }
        );
      }
    };

    getCurrentTab();
  }, []);

  return (
    <div className="app-container">
      <Title level={3}>Page Images</Title>
      {loading ? (
        <Spin size="large" />
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={images}
          renderItem={(item) => (
            <List.Item>
              <Card>
                <img
                  src={item.src}
                  alt={item.alt}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <p>Size: {item.width}x{item.height}</p>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}

export default App;