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

  async balance(publicKey: string): Promise<{ tokens: number }> {
    const revs = await this.computer.queryRevs({ publicKey })
    const tokenBags = await Promise.all(
      revs.map(rev => this.computer.sync(rev))
    )
    return tokenBags.reduce((prev, curr) => prev + curr.tokens, 0)
    // return tokenBags.reduce(({ tokens: prevTokens }, { tokens: currTokens }) => { tokens: prevTokens + currTokens }, { tokens: 0 })
  }
}
