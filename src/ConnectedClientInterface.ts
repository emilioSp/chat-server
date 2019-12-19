import * as net from 'net';

export default interface ConnectedClientInterface {
  readonly socket: net.Socket;
  getId(): string;
  send(message: Buffer | string): void;
  destroy(): void;
  closeConnection(): void;
}
