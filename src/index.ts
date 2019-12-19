import Server from './Server';
const PORT = Number(process.env.PORT) || 10000;
const s = new Server(PORT);
