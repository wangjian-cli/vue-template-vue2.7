import { splitVendorChunkPlugin, UserConfigExport, ConfigEnv, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue2';
import legacy from '@vitejs/plugin-legacy';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { AtomResolver } from '@atom/auto-import-resolver';
import { createHtmlPlugin } from 'vite-plugin-html';
import { resolve } from 'path';
import pxtovw from 'postcss-px-to-viewport';
import autoprefixer from 'autoprefixer';
const loder_pxtovw = pxtovw({
  viewportWidth: 375,
  viewportUnit: 'vw'
});
// 自动添加前缀
const loader_autoprefixer = autoprefixer({
  overrideBrowserslist: ['Android 4.1', 'iOS 7.1'],
  grid: true
});

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_APP_BASE_URL,
    plugins: [
      vue(),
      splitVendorChunkPlugin(),
      legacy({
        targets: ['defaults', 'Android > 44', 'Safari > 8', 'iOS > 8'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      createHtmlPlugin({
        inject: {
          data: {
            ...env
          }
        }
      }),
      AutoImport({
        // 不用手动导入ref,reactive,onmounted
        imports: ['vue', 'vue-router'],
        // 不用手动导入组件的方法
        // resolvers:[],
        dts: 'src/types/auto-imports.d.ts'
      }),
      Components({
        // 不用手动导入组件
        resolvers: [AtomResolver()],
        dts: 'src/types/components.d.ts'
      })
    ],
    // 全局导入common.less
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/style/common.less";'
        }
      },
      postcss: {
        plugins: [loder_pxtovw, loader_autoprefixer]
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
      chunkSizeWarningLimit: 2000,
      sourcemap: env.VITE_APP_CURRENTMODE !== 'release'
    },
    // 路径简称
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        _t: resolve(__dirname, 'src/utils/tools.ts')
        // _a: resolve(__dirname, 'src/api/index.ts'),
        // _c: resolve(__dirname, 'src/components')
      }
    }
  };
};
