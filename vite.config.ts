import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue2';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
export default defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    base: env.VITE_MODE_BASE_URL,
    define: {},
    plugins: [
      vue(),
      legacy({
        // legacy不识别chrome49，所以选用chrome40
        targets: ['chrome >= 40'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
      AutoImport({
        // 不用导入ref,reactive,onmounted
        imports: ['vue', 'vue-router'],
        // 不用导入element的方法
        // resolvers: [ElementUiResolver()],
        dts: 'src/types/auto-imports.d.ts'
      }),
      Components({
        // 不用导入element的组件
        // resolvers: [ElementUiResolver()],
        dts: 'src/types/components.d.ts'
      })
    ],
    // 路径简称
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        // _t: resolve(__dirname, 'src/utils/tools.ts'),
        // _a: resolve(__dirname, 'src/api/index.ts'),
        // _c: resolve(__dirname, 'src/components'),
        vue: 'vue/dist/vue.esm.js'
      }
    },
    // 全局导入common.less
    css: {
      preprocessorOptions: {
        less: {
          additionalData: '@import "@/assets/style/common.less";'
        }
      }
    },
    // 本地调试起的服务
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
    // 编译
    build: {
      // target: 'es2015',
      //以防止 vite 将 rgba() 颜色转化为 #RGBA 十六进制符号的形式。 2.6.6开始有 2.6.6 打包失败 2.6.7 以上
      cssTarget: 'chrome49',
      //去除console
      terserOptions: {
        compress: {
          // eslint-disable-next-line camelcase
          drop_console: true,
          // eslint-disable-next-line camelcase
          drop_debugger: true
        }
      },
      // 要去除console需要增加如下选项才能执行
      minify: 'terser',
      outDir: 'html',
      assetsInlineLimit: 102400,
      rollupOptions: {
        output: {
          chunkFileNames: () => 'js/[name]-[hash].js',
          assetFileNames: (assetInfo: any) => {
            if (/\.css$/.test(assetInfo.name)) {
              return 'css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
          entryFileNames: 'js/[name]-[hash].js'
        }
      }
    }
  };
});
