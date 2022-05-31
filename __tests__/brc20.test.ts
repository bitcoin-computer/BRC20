import { Computer } from 'bitcoin-computer-lib';
import { BRC20 } from '../src/brc20';
import { Bucket } from '../src/bucket'

describe('Bitcoin Computer', () => {
  it('should create a new token', async () => {
    const computer = new Computer({
      seed: 'replace this seed',

      // uncomment to run locally
      chain: 'BTC',
      url: 'http://127.0.0.1:3000',
      network: 'regtest'
    });
    const publicKeyString = computer.db.wallet.getPublicKey().toString()

    const bucket = await computer.new(Bucket, [publicKeyString, 3, 'test'])
    const erc20 = new BRC20(bucket, computer)
    expect(erc20).toBeDefined()
  })

  it.only('should computer the balance', async () => {
    const computer = new Computer({
      seed: 'replace this seed',

      // uncomment to run locally
      chain: 'BTC',
      url: 'http://127.0.0.1:3000',
      network: 'regtest'
    });
    const publicKeyString = computer.db.wallet.getPublicKey().toString()

    const bucket = await computer.new(Bucket, [publicKeyString, 3, 'test'])
    const brc20 = new BRC20(bucket, computer)
    expect(brc20).toBeDefined()
    expect(await brc20.balance(publicKeyString)).toBe(3)
  }, 20000)
})
