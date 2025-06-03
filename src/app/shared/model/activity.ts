export class Activity {
  constructor(
    public id: string,
    public _userID: string,
    public title: string,
    public description: string,
    public _date: string | Date, // Permite string ou Date
    public hour: string,
    public address: string,
    public clientNumber: string,
    public clientName: string,
    public price: number,
    public pricePayed: number = 0,
    public done: boolean = false,
    public paied: boolean = false,
    ) {
    if (typeof this._date === 'string') {
      this._date = new Date(this._date);
    }
    const hourSplit = hour.split(':').map(Number);
    this._date.setHours(hourSplit[0]);
    this._date.setMinutes(hourSplit[1]);
  }

  get userID(): string {
    return this._userID;
  }

  set userID(value: string) {
    this._userID = value;
  }

  get date(): string | Date {
    return this._date;
  }

  set date(value: string | Date) {
    this._date = value;
  }
}
