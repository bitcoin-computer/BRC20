import { Bucket } from './bucket'

export class BRC20 {
  bucket: Bucket
  computer: any

  constructor(bucket: Bucket, computer: any) {
    this.bucket = bucket
    this.computer = computer
  }

  send(amount, to) {
    return this.bucket.send(amount, to)
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
      balance += object.coins
    }
    return balance
  }
}
