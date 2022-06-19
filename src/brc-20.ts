import { Computer } from 'bitcoin-computer-lib'
import { TokenBag } from './token-bag'

export class BRC20 {
  name: string
  symbol: string
  computer: Computer
  mintId: string

  constructor(name: string, symbol: string, computer: Computer, mintId?: string) {
    this.name = name
    this.symbol = symbol
    this.computer = computer
    this.mintId = mintId
  }

  async mint(publicKey: string, amount: number) {
    const args = [publicKey, amount, this.name, this.symbol]
    const tokenBag = await this.computer.new(TokenBag, args)
    return this.mintId = tokenBag._root
  }

  async totalSupply(): Promise<number> {
    if(!this.mintId) throw new Error('Please set a mint id.')
    const rootBag = await this.computer.sync(this.mintId)
    return rootBag.tokens
  }

  async getBags(publicKey): Promise<TokenBag[]> {
    if (!this.mintId) throw new Error('Please set a mint id.')
    const revs = await this.computer.queryRevs({
      contract: TokenBag,
      publicKey
    })
    const bags = await Promise.all(
      revs.map(async (rev: string) => this.computer.sync(rev))
    )
    return bags.flatMap(bag => bag._root === this.mintId ? [bag] : [])
  }

  async balanceOf(publicKey: string): Promise<number> {
    const bags = await this.getBags(publicKey)
    return bags.reduce((prev, curr) => prev + curr.tokens, 0)
  }

  async transfer(to: string, amount: number) {
    const owner = this.computer.db.wallet.getPublicKey().toString()
    const bags = await this.getBags(owner)
    while (amount > 0) {
      const [bag] = bags.splice(0, 1)
      const available = Math.min(amount, bag.tokens)
      await bag.transfer(to, available)
      amount -= bag.tokens
    }
    if (amount > 0)
      throw ('Could not send entire amount')
  }
}
