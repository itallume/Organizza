export class Activity {
  constructor(
    public id: number,
    public userID: String,
    public title: string,
    public description: string,
    public date: string,
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
