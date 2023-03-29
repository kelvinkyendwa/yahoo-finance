import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import axios from 'axios';

interface StockData {
  companyName: string;
  ticketSymbol: string;
  currentPrice: number;
  changePercentage: number;
}

@Component({
  selector: 'app-stock-data',
  templateUrl: './stock-data.component.html',
  styleUrls: ['./stock-data.component.css']
})
export class StockDataComponent {
  orderBy: string = '';
  orderAsc: boolean = true;
  stockData$: Observable<StockData[]>;

  constructor(private http: HttpClient) {
    this.stockData$ = this.getStockData();
  }

  getStockData(): Observable<StockData[]> {
    const apiUrl = 'https://finance.yahoo.com/quotes/API,Documentation/view/v1/';
    // @ts-ignore
    return axios.get(apiUrl).then(response => {
      const data = response.data;
      console.log(data)
      return data.map((item: any) => ({
        companyName: item.companyName,
        ticketSymbol: item.ticketSymbol,
        currentPrice: item.currentPrice,
        changePercentage: item.changePercentage
      })).sort((a: { companyName: string; ticketSymbol: string; currentPrice: number; changePercentage: number; }, b: { companyName: any; ticketSymbol: any; currentPrice: number; changePercentage: number; }) => {
        const order = this.orderAsc ? 1 : -1;
        switch (this.orderBy) {
          case 'companyName':
            return order * a.companyName.localeCompare(b.companyName);
          case 'ticketSymbol':
            return order * a.ticketSymbol.localeCompare(b.ticketSymbol);
          case 'currentPrice':
            return order * (a.currentPrice - b.currentPrice);
          case 'changePercentage':
            return order * (a.changePercentage - b.changePercentage);
          default:
            return 0;
        }
      });
    });
  }

  sortBy(column: string) {
    if (column === this.orderBy) {
      this.orderAsc = !this.orderAsc;
    } else {
      this.orderBy = column;
      this.orderAsc = true;
    }
    this.stockData$ = this.getStockData();
  }
}
