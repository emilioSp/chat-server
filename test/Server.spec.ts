import ClientTestHelper from './ClientTestHelper';
import Server from '../src/Server';

const PORT = 10000;
const HOST = '127.0.0.1';

describe('Test suite', () => {
  let server: Server;

  beforeAll(() => {
    server = new Server(PORT);
  });

  afterAll(() => {
    server.close();
  });

  test('A client should connect successfully', async () => {
    const client = new ClientTestHelper(HOST, PORT);
    await client.connectToServer();
  });

  test('A client should not receive its message', async () => {
    const client = new ClientTestHelper(HOST, PORT);
    await client.connectToServer();
    const messageToBroadcast = 'Hello from my self';
    client.failOnThisMessage(messageToBroadcast);

    client.socket.write(messageToBroadcast, () => {
      client.socket.end();
    });
  });

  test('Clients should receive broadcast messages', async () => {
    const messageToBroadcast = 'Hello from client one!!!';
    const client = new ClientTestHelper(HOST, PORT);
    await client.connectToServer();
    const client2 = new ClientTestHelper(HOST, PORT);
    await client2.connectToServer();
    const client3 = new ClientTestHelper(HOST, PORT);
    await client3.connectToServer();

    client.socket.write(messageToBroadcast);

    await client2.waitForTheExpectedMessage(messageToBroadcast);
    await client3.waitForTheExpectedMessage(messageToBroadcast);
  });
});
