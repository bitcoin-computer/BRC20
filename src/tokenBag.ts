

export class TokenBag {
  tokens: number
  _owners: string[]
  name: string
  symbol: string

  constructor(to: string, supply: number, name: string, symbol = '') {
    this.tokens = supply
    this._owners = [to]
    this.name = name
    this.symbol = symbol
  }

  send(amount, to) {
    if (this.tokens < amount) throw new Error()
    this.tokens -= amount
    return new TokenBag(to, amount, this.name, this.symbol)
  }
}
