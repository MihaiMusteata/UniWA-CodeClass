// vite.config.js
import path from "path";
import checker from "file:///E:/UTM/Anul%20IV/UNIWA/Educational%20Technology%20and%20IT%20Didactics/CodeClass/CodeClass.WEB/vite-js/node_modules/vite-plugin-checker/dist/esm/main.js";
import { defineConfig } from "file:///E:/UTM/Anul%20IV/UNIWA/Educational%20Technology%20and%20IT%20Didactics/CodeClass/CodeClass.WEB/vite-js/node_modules/vite/dist/node/index.js";
import react from "file:///E:/UTM/Anul%20IV/UNIWA/Educational%20Technology%20and%20IT%20Didactics/CodeClass/CodeClass.WEB/vite-js/node_modules/@vitejs/plugin-react-swc/index.mjs";
var PORT = 3030;
var vite_config_default = defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
        dev: { logLevel: ["error"] }
      },
      overlay: {
        position: "tl",
        initialIsOpen: false
      }
    })
  ],
  resolve: {
    alias: [
      {
        find: /^~(.+)/,
        replacement: path.join(process.cwd(), "node_modules/$1")
      },
      {
        find: /^src(.+)/,
        replacement: path.join(process.cwd(), "src/$1")
      }
    ]
  },
  server: { port: PORT, host: true },
  preview: { port: PORT, host: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxVVE1cXFxcQW51bCBJVlxcXFxVTklXQVxcXFxFZHVjYXRpb25hbCBUZWNobm9sb2d5IGFuZCBJVCBEaWRhY3RpY3NcXFxcQ29kZUNsYXNzXFxcXENvZGVDbGFzcy5XRUJcXFxcdml0ZS1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcVVRNXFxcXEFudWwgSVZcXFxcVU5JV0FcXFxcRWR1Y2F0aW9uYWwgVGVjaG5vbG9neSBhbmQgSVQgRGlkYWN0aWNzXFxcXENvZGVDbGFzc1xcXFxDb2RlQ2xhc3MuV0VCXFxcXHZpdGUtanNcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1VUTS9BbnVsJTIwSVYvVU5JV0EvRWR1Y2F0aW9uYWwlMjBUZWNobm9sb2d5JTIwYW5kJTIwSVQlMjBEaWRhY3RpY3MvQ29kZUNsYXNzL0NvZGVDbGFzcy5XRUIvdml0ZS1qcy92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNvbnN0IFBPUlQgPSAzMDMwO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBjaGVja2VyKHtcbiAgICAgIGVzbGludDoge1xuICAgICAgICBsaW50Q29tbWFuZDogJ2VzbGludCBcIi4vc3JjLyoqLyoue2pzLGpzeCx0cyx0c3h9XCInLFxuICAgICAgICBkZXY6IHsgbG9nTGV2ZWw6IFsnZXJyb3InXSB9LFxuICAgICAgfSxcbiAgICAgIG92ZXJsYXk6IHtcbiAgICAgICAgcG9zaXRpb246ICd0bCcsXG4gICAgICAgIGluaXRpYWxJc09wZW46IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9efiguKykvLFxuICAgICAgICByZXBsYWNlbWVudDogcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdub2RlX21vZHVsZXMvJDEnKSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpbmQ6IC9ec3JjKC4rKS8sXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy8kMScpLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBzZXJ2ZXI6IHsgcG9ydDogUE9SVCwgaG9zdDogdHJ1ZSB9LFxuICBwcmV2aWV3OiB7IHBvcnQ6IFBPUlQsIGhvc3Q6IHRydWUgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnZSxPQUFPLFVBQVU7QUFDamYsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUlsQixJQUFNLE9BQU87QUFFYixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsTUFDTixRQUFRO0FBQUEsUUFDTixhQUFhO0FBQUEsUUFDYixLQUFLLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRTtBQUFBLE1BQzdCO0FBQUEsTUFDQSxTQUFTO0FBQUEsUUFDUCxVQUFVO0FBQUEsUUFDVixlQUFlO0FBQUEsTUFDakI7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsaUJBQWlCO0FBQUEsTUFDekQ7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLEtBQUssS0FBSyxRQUFRLElBQUksR0FBRyxRQUFRO0FBQUEsTUFDaEQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUSxFQUFFLE1BQU0sTUFBTSxNQUFNLEtBQUs7QUFBQSxFQUNqQyxTQUFTLEVBQUUsTUFBTSxNQUFNLE1BQU0sS0FBSztBQUNwQyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
