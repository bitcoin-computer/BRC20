import { Computer } from 'bitcoin-computer-lib'
import { TokenBag } from './token-bag'

interface IBRC20 {
  mint(publicKey: string, amount: number): Promise<string>
}

export class BRC20 implements IBRC20 {
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

  async mint(publicKey: string, amount: number): Promise<string> {
    const args = [publicKey, amount, this.name, this.symbol]
    const tokenBag = await this.computer.new(TokenBag, args)
    this.mintId = tokenBag._root
    return this.mintId
  }

  async totalSupply(): Promise<number> {
    if (!this.mintId) throw new Error('Please set a mint id.')
    const rootBag = await this.computer.sync(this.mintId)
    return rootBag.tokens
  }

  async getBags(publicKey): Promise<TokenBag[]> {
    if (!this.mintId) throw new Error('Please set a mint id.')
    const revs = await this.computer.queryRevs({
      contract: TokenBag,
      publicKey,
    })
    const bags = await Promise.all(revs.map(async (rev: string) => this.computer.sync(rev)))
    return bags.flatMap((bag: TokenBag & { _root: string }) =>
      bag._root === this.mintId ? [bag] : []
    )
  }

  async balanceOf(publicKey: string): Promise<number> {
    const bags = await this.getBags(publicKey)
    return bags.reduce((prev, curr) => prev + curr.tokens, 0)
  }

  async transfer(to: string, amount: number) {
    let _amount = amount
    const owner = this.computer.db.wallet.getPublicKey().toString()
    const bags = await this.getBags(owner)
    const results = []
    while (_amount > 0) {
      const [bag] = bags.splice(0, 1)
      const available = Math.min(_amount, bag.tokens)
      results.push(bag.transfer(to, available))
      _amount -= bag.tokens
    }
    if (_amount > 0) throw new Error('Could not send entire amount')
    await Promise.all(results)
  }
}