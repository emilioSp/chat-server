import * as net from 'net';

export default class ClientTestHelper {
  socket: net.Socket;
  host: string;
  port: number;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    this.socket = new net.Socket();
  }

  connectToServer() {
    return new Promise((resolve, reject) => {
      this.socket.connect(this.port, this.host, () => {
        resolve('connected');
      });
    });
  }

  waitForTheExpectedMessage(message: string) {
    return new Promise((resolve, reject) => {
      this.socket.on('data', data => {
        if (data.toString().includes(message)) {
          resolve('received');
        }
      });
    });
  }

  failOnThisMessage(message: string) {
    this.socket.on('data', data => {
      expect(data.toString().includes(message)).toBeFalsy();
    });
  }
}
