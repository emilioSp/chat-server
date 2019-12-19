import ConnectedClientInterface from './ConnectedClientInterface';
import * as net from 'net';

export default class ConnectedClient implements ConnectedClientInterface {
  readonly socket: net.Socket;

  constructor(socket: net.Socket) {
    this.socket = socket;
  }

  public getId(): string {
    return `${this.socket.remoteAddress}:${this.socket.remotePort}`;
  }

  public send(message: Buffer | string): void {
    this.socket.write(message);
  }

  public closeConnection(): void {
    this.socket.end(() => this.destroy());
  }

  public destroy(): void {
    this.socket.destroy();
  }
}
