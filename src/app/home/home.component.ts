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
  selectedDate = new Date();
  initDate = new Date("2023/01/5"); //the first date taken as reference for the calculations
    
  myForm: FormGroup;
  paramForm: FormGroup;

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
      selectedDate: [this.selectedDate],
    });
    this.paramForm = this.fb.group({
      paramDate: [this.initDate],
    });
    this.calculate();
  }


  dateClass = (d: Date) => {
    const date = d.getDay();
    // Highlight saturday and sunday.
    return 'highlight-dates';
  }

  onDateChanged(){
    this.selectedDate = this.myForm.value.selectedDate
    console.log('Selected date is ', this.selectedDate);
    this.calculate();
  }
  onDateParamChange(){
    this.initDate = this.paramForm.value.paramDate
    console.log('Init date is ', this.initDate);
    this.calculate();
  }
  calculate() {
    //init data table
    this.weekData = [];
    this.dataSource.connect().next(this.weekData);
    
    //creer la date avec getTime pour eviter la modification par affectation
    let d =  new Date(this.selectedDate.getTime());
    const lastSunday = this.getLastSunday(d);
    
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
        case 1: day++; weekObj.dim = { date: currD.getDate().toString(), color: this.getDayColor(currD), circle: this.isSelectedDate(currD) }; break;
        case 2: day++; weekObj.lun = { date: currD.getDate().toString(), color: this.getDayColor(currD), circle: this.isSelectedDate(currD) }; break;
        case 3: day++; weekObj.mar = { date: currD.getDate().toString(), color: this.getDayColor(currD), circle: this.isSelectedDate(currD) }; break;
        case 4: day++; weekObj.mer = { date: currD.getDate().toString(), color: this.getDayColor(currD), circle: this.isSelectedDate(currD) }; break;
        case 5: day++; weekObj.jeu = { date: currD.getDate().toString(), color: this.getDayColor(currD), circle: this.isSelectedDate(currD) }; break;
        case 6: day++; weekObj.ven = { date: currD.getDate().toString(), color: this.getDayColor(currD), circle: this.isSelectedDate(currD) }; break;
        case 7: day++; weekObj.sam = { date: currD.getDate().toString(), color: this.getDayColor(currD), circle: this.isSelectedDate(currD) }; break;
      }
      currD.setDate(currD.getDate() + 1);
      if (day > 7) {
        this.weekData.push(weekObj)
        this.dataSource.connect().next(this.weekData);
        weekObj = new Week();
        day = 1;
        //console.log(weekObj);
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
    //console.log("current date ", currD);
    
    //obtenir le nb de jour total depuis la ref
    let nbDayFromRef = this.dateDiff(this.initDate, currD);
    //console.log("Number of day from ref", nbDayFromRef);
    //faire le modulo pour scinder en 8 jour pour obtenu le numero sur les 8
    let jourCourant = nbDayFromRef  % 8;
    //si jourCourant = 0,1,1,3 : ces sont les 04 jours de repos
    //si jourCourant = 4,5 : ces sont les 2 jours de travail matin
    //si jourCourant = 6,7 : ces sont les 2 jours de travail de nuit
    //console.log('Pos jour courant sur 8 = : ', jourCourant );
    if(jourCourant < 4){
      //console.log('jour de repos');
      //pas de couleur comme le font est déjà blanc
      return '';
    } else if(jourCourant > 5) {
      //console.log('jour de nuit');
      return 'yellow_color';
    }else {
      //console.log('jour de matin');
      return 'green_color';
    }
  }
  dateDiff(dateEarlier : Date, dateLater: Date) {
    var one_day=1000*60*60*24
    return (  Math.round((dateLater.getTime()-dateEarlier.getTime())/one_day));
  }

isSelectedDate(date: Date){
  
 return (
      this.selectedDate.getFullYear() == date.getFullYear() &&
      this.selectedDate.getMonth() == date.getMonth() &&
      this.selectedDate.getDate() == date.getDate() ? 'circle_selected_date' : ''
    );
  }
}




