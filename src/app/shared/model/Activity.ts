export class Activity {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public date:Date,
    public address: string,
    public clientNumber: number,
    public clientName: string,
    public price: number,
    public pricePayed: number = 0,
    public done: boolean = false,
    public paied: boolean = false,

    ) {
  }
}
