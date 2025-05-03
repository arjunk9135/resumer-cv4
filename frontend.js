// Frontend-only entry point
const { createServer } = require('vite');
const path = require('path');

async function startFrontendServer() {
  try {
    const vite = await createServer({
      configFile: path.resolve(__dirname, 'vite.config.ts'),
      server: {
        port: 5000, // Use port 5000 since Replit expects this
        host: '0.0.0.0', // Allow external connections
      },
      root: path.resolve(__dirname, 'client'),
    });

    await vite.listen();
    
    // Log the server details
    const networkUrls = vite.resolvedUrls?.network || [];
    console.log(`
🚀 Frontend server running!
📑 Local URL: ${vite.resolvedUrls?.local?.[0] || 'http://localhost:5000'}
🌎 Network URL: ${networkUrls[0] || 'http://localhost:5000'}
    `);
  } catch (e) {
    console.error('Error starting frontend server:', e);
    process.exit(1);
  }
}

startFrontendServer();