//=============================================================================
//===
//=== Copyright (C) 2024 Andrea Carboni
//===
//=== Use of this source code is governed by an MIT-style license that can be
//=== found in the LICENSE file
//=============================================================================

import {DateAdapter} from "@angular/material/core";

//=============================================================================

const monthLong=[
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const monthShort = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]

const monthNarrow = [ "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D" ]

const dayLong   = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ]
const dayShort  = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
const dayNarrow = [ "S", "M", "T", "W", "T", "F", "S" ]

const dayNames = [
   "1",  "2",  "3",  "4",  "5",  "6",  "7",  "8",  "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
  "31"
]

//=============================================================================

export class IntDateAdapter extends DateAdapter<number>{

  //-------------------------------------------------------------------------
  //---
  //--- Constructor
  //---
  //-------------------------------------------------------------------------

  addCalendarDays(date: number, days: number): number {
    let jsd = this.toJsDate(date, days, 0)
    return this.toIntDate(jsd);
  }

  //-------------------------------------------------------------------------

  addCalendarMonths(date: number, months: number): number {
    let jsd = this.toJsDate(date, 0, months)
    let newDate = this.toIntDate(jsd)

    //--- We should fix jumps to non-existent days, like from Jan-31 to Feb-31 that
    //--- brings to Mar-03

    console.log("addCalendarMonths: "+date +" --> "+ newDate+" (months "+months+")")
    return newDate;
  }

  //-------------------------------------------------------------------------

  addCalendarYears(date: number, years: number): number {
    return this.addCalendarMonths(date, years * 12);
  }

  //-------------------------------------------------------------------------

  clone(date: number): number {
    return date;
  }

  //-------------------------------------------------------------------------

  createDate(year: number, month: number, date: number): number {
    return this.build(date, month +1, year);
  }

  //-------------------------------------------------------------------------

  format(date: number, displayFormat: any): string {
    let y = this.year(date)
    let m = this.month(date)

    if (displayFormat.month == "short") {
      return monthShort[m -1 ] +" "+ y
    }

    return this.toIso8601(date);
  }

  //-------------------------------------------------------------------------

  getDate(date: number): number {
    return this.day(date);
  }

  //-------------------------------------------------------------------------

  getDateNames(): string[] {
    return dayNames;
  }

  //-------------------------------------------------------------------------

  getDayOfWeek(date: number): number {
    return this.toJsDate(date, 0, 0).getDay();
  }

  //-------------------------------------------------------------------------

  getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
    switch (style) {
      case "long"  : return dayLong
      case "short" : return dayShort
      case "narrow": return dayNarrow
    }
  }

  //-------------------------------------------------------------------------

  getFirstDayOfWeek(): number {
    return 0;
  }

  //-------------------------------------------------------------------------

  getMonth(date: number): number {
    return this.month(date) -1;
  }

  //-------------------------------------------------------------------------

  getMonthNames(style: "long" | "short" | "narrow"): string[] {
    switch (style) {
      case "long"  : return monthLong
      case "short" : return monthShort
      case "narrow": return monthNarrow
    }
  }

  //-------------------------------------------------------------------------

  getNumDaysInMonth(date: number): number {
    let y = this.year(date)
    let m = this.month(date)

    if (m == 4 || m == 6 || m == 9 || m == 11) {
      return 30
    }

    //--- Handle february

    if (m == 2) {
      if (this.isLeapYear(y)) {
        return 29
      }
      else {
        return 28
      }
    }

    return 31;
  }

  //-------------------------------------------------------------------------

  getYear(date: number): number {
    return this.year(date);
  }

  //-------------------------------------------------------------------------

  getYearName(date: number): string {
    return String(this.year(date));
  }

  //-------------------------------------------------------------------------

  invalid(): number {
    return 0;
  }

  //-------------------------------------------------------------------------

  isDateInstance(obj: any): boolean {
    return typeof(obj) == "number"
  }

  //-------------------------------------------------------------------------

  isValid(date: number): boolean {
    let y = this.year(date)
    let m = this.month(date)
    let d = this.day(date)

    //--- Rough validation

    if (y<1000 || y>9999 || m<1 || m>12 || d<1 || d>31) {
      return false
    }

    //--- Manage months with 30 days

    if (m in [4, 6, 9, 11]) {
      if (d>30) {
        return false
      }
    }

    //--- Handle february

    else if (m == 2) {
      if (this.isLeapYear(y)) {
        if (d > 29) {
          return false
        }
      }
      else {
        if (d > 28) {
          return false
        }
      }
    }

    return true
  }

  //-------------------------------------------------------------------------

  parse(value: any, parseFormat: any): number | null {
    let v = String(value)

    if (v.length == 10) {
      if (v.charAt(4) == "-" && v.charAt(7) == "-") {
        let y = Number(v.substring(0,  4))
        let m = Number(v.substring(5,  7))
        let d = Number(v.substring(8, 10))

        if ( !Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
          return this.build(d, m, y)
        }
      }
    }

    return null;
  }

  //-------------------------------------------------------------------------

  toIso8601(date: number): string {
    return this.year(date) +"-"+this.paddedMonth(date)+"-"+ this.paddedDay(date);
  }

  //-------------------------------------------------------------------------

  today(): number {
    let now = new Date()
    return this.build(now.getDate(), now.getMonth() +1, now.getFullYear())
  }

  //-------------------------------------------------------------------------
  //---
  //--- Private methods
  //---
  //-------------------------------------------------------------------------

  year (date:number):number { return Math.trunc(date/10000)     }
  month(date:number):number { return Math.trunc(date/100) % 100 }
  day  (date:number):number { return date % 100                    }

  //-------------------------------------------------------------------------

  build(day:number, month:number, year:number):number { return day + month*100 + year*10000 }

  //-------------------------------------------------------------------------

  paddedMonth(date:number):string {
    let v = Math.trunc(date/100) % 100

    return v>=10 ? ""+v : "0"+v
  }

  //-------------------------------------------------------------------------

  paddedDay(date:number):string {
    let v = date % 100

    return v>=10 ? ""+v : "0"+v
  }

  //-------------------------------------------------------------------------

  isLeapYear(year:number): boolean {
    let digits = year % 100

    return digits / 4 == Math.trunc(digits / 4)
  }

  //-------------------------------------------------------------------------

  toJsDate(date : number, extraDays : number, extraMonths : number) : Date {
    let y = this.year(date)
    let m = this.month(date) + extraMonths
    let d = this.day(date) + extraDays

    let jsd = new Date();
    jsd.setFullYear(y, m -1, d);
    jsd.setHours(0, 0, 0, 0);

    return jsd
  }

  //-------------------------------------------------------------------------

  toIntDate(date : Date) : number {
    return this.build(date.getDate(), date.getMonth() +1, date.getFullYear())
  }
}

//=============================================================================
