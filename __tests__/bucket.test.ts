import { Computer } from 'bitcoin-computer-lib';
import { Bucket } from '../src/bucket';

describe('Bitcoin Computer', () => {
  it('should export a function', () => {
    expect(Computer).toBeDefined();
    expect(typeof Computer).toBe('function');
  });

  it('should create a computer object', () => {
    const computer = new Computer({ seed: 'replace this seed' });

    expect(computer).toBeDefined();
    expect(typeof computer).toBe('object');
  });

  it('should create a Javascript object', () => {
    expect(Bucket).toBeDefined();
    expect(typeof Bucket).toBe('function');

    const token = new Bucket('to', 3, 'test');
    expect(token).toBeDefined();
  });

  it('should create a smart object', async () => {
    const computer = new Computer({
      seed: 'replace this seed',

      // uncomment to run locally
      chain: 'BTC',
      url: 'http://127.0.0.1:3000',
      network: 'regtest'
    });
    const publicKeyString = computer.db.wallet.getPublicKey().toString()

    const token = await computer.new(Bucket, [publicKeyString, 3, 'test']);
    expect(token).toEqual({
      coins: 3,
      _owners: [publicKeyString],
      name: 'test',
      symbol: '',
      _id: expect.any(String),
      _rev: expect.any(String),
      _root: expect.any(String),
    });
  }, 20000);

  it('should update a smart object', async () => {
    const computer = new Computer({
      seed: 'replace this seed',
      // uncomment to run locally
      chain: 'BTC',
      url: 'http://127.0.0.1:3000',
      network: 'regtest'
    });
    const publicKeyString = computer.db.wallet.getPublicKey().toString()

    const computer2 = new Computer({
      // uncomment to run locally
      chain: 'BTC',
      url: 'http://127.0.0.1:3000',
      network: 'regtest'
    });
    const publicKeyString2 = computer2.db.wallet.getPublicKey().toString()

    const token = await computer.new(Bucket, [publicKeyString, 3, 'test']);
    const newToken = await token.send(1, publicKeyString2);
    expect(token).toEqual({
      coins: 2,
      _owners: [publicKeyString],
      name: 'test',
      symbol: '',
      _id: expect.any(String),
      _rev: expect.any(String),
      _root: expect.any(String),
    });

    expect(newToken).toEqual({
      coins: 1,
      _owners: [publicKeyString2],
      name: 'test',
      symbol: '',
      _id: expect.any(String),
      _rev: expect.any(String),
      _root: expect.any(String),
    });
  }, 20000);
});
