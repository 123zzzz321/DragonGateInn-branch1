import { App as AntdApp } from 'antd';

export const useMessage = () => {
  const { message } = AntdApp.useApp();
  return message;
};
