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
    // Se receber uma string de data, mantém como string para evitar problemas de timezone
    if (typeof this._date === 'string') {
      // Mantém como string se já está no formato correto YYYY-MM-DD
      if (this._date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Não faz conversão, mantém como string
      } else {
        // Se for outro formato, converte para o formato correto
        const dateObj = new Date(this._date);
        this._date = dateObj.toISOString().split('T')[0];
      }
    } else if (this._date instanceof Date) {
      // Se for Date, converte para string no formato YYYY-MM-DD
      this._date = this._date.toISOString().split('T')[0];
    }
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
    if (typeof value === 'string') {
      this._date = value;
    } else {
      this._date = value.toISOString().split('T')[0];
    }
  }
}
