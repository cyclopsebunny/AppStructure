import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// @ts-expect-error — CSS export has no type declaration
import '@component-library/core/styles';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
