import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        cart: 'cart.html',
        dashboard: 'user-dashboard.html',
        details: 'product-details.html',
        help: 'help.html',
        shipping: 'shipping.html',
        returns: 'returns.html',
        warranty: 'warranty.html',
        contact: 'contact.html',
        blog: 'blog.html',
        proSetups: 'pro-setups.html',
        tournaments: 'tournaments.html',
        affiliate: 'affiliate.html',
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
