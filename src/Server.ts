import * as net from 'net';
import MessageInterface from './MessageInterface';
import welcomeMessage from './welcomeMessage';
import ConnectedClient from './ConnectedClient';
import ConnectedClientInterface from './ConnectedClientInterface';

export default class Server {
  private connectedClients: Map<string, ConnectedClientInterface>;
  private server: net.Server;

  constructor(port: Number) {
    this.server = net.createServer().listen(port);
    this.connectedClients = new Map<string, ConnectedClientInterface>();
    this.server.on('connection', (socket) => this.registerClient(socket));
  }

  private registerClient(socket: net.Socket) {
    const connectedClient = new ConnectedClient(socket);
    this.connectedClients.set(connectedClient.getId(), connectedClient);
    this.attachClientEventHandlers(connectedClient);
    this.welcomeNewClient(connectedClient);
  }

  private attachClientEventHandlers(client: ConnectedClientInterface) {
    client.socket.on('data', (data) => this.broadcast({ clientId: client.getId(), payload: data }));
    client.socket.on('end', () => this.releaseClient(client));
  }

  private welcomeNewClient(client: ConnectedClientInterface) {
    client.send(welcomeMessage);
    this.broadcast({ clientId: client.getId(), payload: `joined chat\n` });
  }

  private broadcast(message: MessageInterface) {
    const data = `${message.clientId}: ${message.payload}`;
    console.log(data);
    for (const [clientId, client] of this.connectedClients.entries()) {
      if (clientId !== message.clientId) {
        client.send(data);
      }
    }
  }

  private releaseClient(client: ConnectedClient) {
    this.connectedClients.delete(client.getId());
    client.destroy();
    this.broadcast({ clientId: client.getId(), payload: `abandoned chat\n` });
  }

  public close() {
    this.server.close();
    for (const [, client] of this.connectedClients.entries()) {
      client.closeConnection();
    }
  }
}
