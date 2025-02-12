export class Activity {
  // constructor(
  //   public id: number,
  //   public name: string,
  //   public description: string,
  //   public hour: string,
  //   public address: string,
  //   public clientNumber: number,
  //   public clientName: string,
  //   public price: number,
  //   public done: boolean = false,
  //   public paied: boolean = false,
  //   ) {
  // }
  public name:String;
  public data:Date;
  constructor(data:Date ){
    this.name = "paulo";
    this.data = data;
  }
}
