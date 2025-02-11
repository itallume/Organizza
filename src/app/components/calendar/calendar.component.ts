// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-calendar',
//   standalone: false,
//   templateUrl: './calendar.component.html',
//   styleUrl: './calendar.component.css'
// })
// export class CalendarComponent {

// }

import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  currentDate = new Date();
  days: { date: Date; isPadding: boolean }[] = [];

  constructor(private datePipe: DatePipe) {
    this.generateCalendar();
  }

  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const endDate = lastDay.getDate();

    this.days = [];

    // Dias do mês anterior
    for (let i = 0; i < startDay; i++) {
      const date = new Date(year, month, i - startDay + 1);
      this.days.push({ date, isPadding: true });
    }

    // Dias do mês atual
    for (let i = 1; i <= endDate; i++) {
      const date = new Date(year, month, i);
      this.days.push({ date, isPadding: false });
    }
  }

  selectDate(date: Date) {
    console.log('Data selecionada:', this.datePipe.transform(date, 'yyyy-MM-dd'));
  }
}