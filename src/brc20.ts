import { TokenBag } from './tokenBag'

export class BRC20 {
  tokenBag: TokenBag
  computer: any

  constructor(tokenBag: TokenBag, computer: any) {
    this.tokenBag = tokenBag
    this.computer = computer
  }

  send(amount, to) {
    return this.tokenBag.send(amount, to)
  }

  async balance(publicKey: string): Promise<number> {
    const revs = await this.computer.queryRevs({ publicKey })
    const objects = await Promise.all(
      revs.map(rev => this.computer.sync(rev))
    )
    return objects.reduce((prev, curr) => prev + curr.tokens, 0)
  }
}
