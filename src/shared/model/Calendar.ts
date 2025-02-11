import { Day } from "./Day";


class Calendar{
  days: Day[];
  
  constructor(){
    this.days = [];
    //aqui vai pegar do banco todos os dias do mes corrente que contem algo e instanciar APENAS os dias que tiverem atividades
  }
}