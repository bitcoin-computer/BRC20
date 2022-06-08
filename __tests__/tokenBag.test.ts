import { Computer } from 'bitcoin-computer-lib';
import { TokenBag } from '../src/tokenBag';

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
    expect(TokenBag).toBeDefined();
    expect(typeof TokenBag).toBe('function');

    const token = new TokenBag('to', 3, 'test');
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

    const token = await computer.new(TokenBag, [publicKeyString, 3, 'test']);
    expect(token).toEqual({
      tokens: 3,
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

    const token = await computer.new(TokenBag, [publicKeyString, 3, 'test']);
    const newToken = await token.send(1, publicKeyString2);
    expect(token).toEqual({
      tokens: 2,
      _owners: [publicKeyString],
      name: 'test',
      symbol: '',
      _id: expect.any(String),
      _rev: expect.any(String),
      _root: expect.any(String),
    });

    expect(newToken).toEqual({
      tokens: 1,
      _owners: [publicKeyString2],
      name: 'test',
      symbol: '',
      _id: expect.any(String),
      _rev: expect.any(String),
      _root: expect.any(String),
    });
  }, 20000);
});
