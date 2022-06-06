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

  async balance(publicKeyString: string): Promise<number> {
    const revs = await this.computer.getRevs(publicKeyString)
    const objects = await Promise.all(
      revs.map(rev => this.computer.sync(rev))
    )
    let balance = 0
    //
    for(let i = 0; i < objects.length; i += 1) {
      const object = objects[i]
      balance += object.tokens
    }
    return balance
  }
}
