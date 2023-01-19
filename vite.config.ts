import { splitVendorChunkPlugin, UserConfigExport, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue2';
import legacy from '@vitejs/plugin-legacy';
import Components from 'unplugin-vue-components/vite';
import { resolve } from 'path';

export default ({ command }: ConfigEnv): UserConfigExport => {
  return {
    plugins: [
      vue(),
      splitVendorChunkPlugin(),
      legacy({
        targets: ['defaults', 'ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      Components()
    ],
    // 全局导入common.less
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/style/common.less";'
        }
      }
    },
    server: {
      port: 4000,
      open: true,
      cors: true,
      host: 'dev.10jqka.com.cn',
      // 设置代理，根据我们项目实际情况配置
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace('/api/', '/')
        }
      }
    },
    build: {
      target: 'es2015',
      chunkSizeWarningLimit: 2000
    },
    // 路径简称
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        _u: resolve(__dirname, 'src/utils')
        // _t: resolve(__dirname, 'src/utils/tools.ts'),
        // _a: resolve(__dirname, 'src/api/index.ts')
      }
    }
  };
};
