import { registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import { Day, Week } from './data';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  startDate = new Date();
  oneDay = 1000 * 3600 * 24;
  myForm: FormGroup;

  showLegend = false;

  //tableau qui affiche 3 ligne pour 3 semaine
  displayedColumns: string[] = ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'];
  weekData: Week[] = [];

  dataSource = new MatTableDataSource(this.weekData);


  constructor(public fb: FormBuilder) {
    registerLocaleData(localeFr, 'fr');
  }

  date: any;

  ngOnInit() {
    this.myForm = this.fb.group({
      selectedDate: [''],
    });
  }


  dateClass = (d: Date) => {
    const date = d.getDay();
    // Highlight saturday and sunday.
    return 'highlight-dates';
  }

  calculate() {
    //init data table
    this.weekData = [];
    this.dataSource.connect().next(this.weekData);

    const date = this.myForm.value.selectedDate
    console.log('Selected date is ', date);

    const lastSunday = this.getLastSunday(date);
    const threeNextWeeks = new Date();
    threeNextWeeks.setTime(lastSunday.getTime() + 21 * this.oneDay);

    //console.log("Last sunday", lastSunday);
    //console.log("After 03 sunday", threeNextWeeks);

    const currD = lastSunday;
    this.loadDataSource(lastSunday,threeNextWeeks);
  }
  //console.log("DATASOURCE", this.datasource);


  loadDataSource(currD: Date, threeNextWeeks: Date) {
    let day = 1;
    let weekObj = new Week();
    while (currD <= threeNextWeeks) {
      switch (day) {
        case 1: day++; weekObj.dim = { date: currD.getDate().toString(), color: this.getDayColor(currD) }; break;
        case 2: day++; weekObj.lun = { date: currD.getDate().toString(), color: this.getDayColor(currD) }; break;
        case 3: day++; weekObj.mar = { date: currD.getDate().toString(), color: this.getDayColor(currD) }; break;
        case 4: day++; weekObj.mer = { date: currD.getDate().toString(), color: this.getDayColor(currD) }; break;
        case 5: day++; weekObj.jeu = { date: currD.getDate().toString(), color: this.getDayColor(currD) }; break;
        case 6: day++; weekObj.ven = { date: currD.getDate().toString(), color: this.getDayColor(currD) }; break;
        case 7: day++; weekObj.sam = { date: currD.getDate().toString(), color: this.getDayColor(currD) }; break;
      }
      currD.setDate(currD.getDate() + 1);
      if (day > 7) {
        this.weekData.push(weekObj)
        this.dataSource.connect().next(this.weekData);
        weekObj = new Week();
        day = 1;
        console.log(weekObj);
      }
    }
    this.showLegend = true;
  }

  getLastSunday(date : Date) {
    const today = date.getDate();
    const currentDay = date.getDay();
    const newDate = date.setDate(today - currentDay - 7);
    return new Date(newDate);
  }

  getDayColor(currD : Date): string {
    const initDate = new Date("2023/01/5"); //the first date taken as reference for the calculations
    const d = new Date()
    console.log("current date ", currD);
    //console.log("time of init date ", initDate.getTime() / this.oneDay);
    //console.log("time of current date ", currD.getTime() / this.oneDay);
    
    //obtenir le nb de jour total depuis la ref
    let nbDayFromRef = (currD.getTime() - initDate.getTime()) / this.oneDay;
    console.log("Number of day from ref", nbDayFromRef);
    //faire le modulo pour scinder en 8 jour pour obtenu le numero sur les 8
    let jourCourant = nbDayFromRef  % 8;
    //si jourCourant = 0,1,1,3 : ces sont les 04 jours de repos
    //si jourCourant = 4,5 : ces sont les 2 jours de travail matin
    //si jourCourant = 6,7 : ces sont les 2 jours de travail de nuit
    console.log('jour de travail ', ((currD.getTime() - initDate.getTime()) / this.oneDay) % 8 );
    if(jourCourant < 4){
      //console.log('jour de repos');
      return '';
    } else if(jourCourant > 5) {
      //console.log('jour de nuit');
      return 'yellow_color'
    }else {
      //console.log('jour de matin');
      return 'green_color';
    }
  }
}




