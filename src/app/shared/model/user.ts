export class User {
  id: string;
  name: string;
  email: string;
  password?: string; // Opcional para responses que não incluem senha

  constructor(id: string = '', name: string = '', email: string = '', password: string = '') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
