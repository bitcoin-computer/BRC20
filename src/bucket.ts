

export class Bucket {
  coins: number
  _owners: string[]
  name: string
  symbol: string

  constructor(to: string, supply: number, name: string, symbol = '') {
    this.coins = supply
    this._owners = [to]
    this.name = name
    this.symbol = symbol
  }

  send(amount, to) {
    if (this.coins < amount) throw new Error()
    this.coins -= amount
    return new Bucket(to, amount, this.name, this.symbol)
  }
}
