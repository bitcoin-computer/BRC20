

export default class Token {
  coins: number
  _owners: string[]
  name: string

  constructor(to: string, supply: number, name: string) {
    this.coins = supply
    this._owners = [to]
    this.name = name
  }

  send(amount, to) {
    if (this.coins < amount) throw new Error()
    this.coins -= amount
    return new Token(to, amount, this.name)
  }
}
