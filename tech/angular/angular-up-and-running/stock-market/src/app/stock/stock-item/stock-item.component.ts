import { Component, OnInit } from '@angular/core';
import { Stock } from 'src/app/model/stock';

@Component({
  selector: 'app-stock-item',
  templateUrl: './stock-item.component.html',
  styleUrls: ['./stock-item.component.css']
})
export class StockItemComponent implements OnInit {

  public stock: Stock;
  public stockStyles;

  constructor() { }

  ngOnInit() {
    this.stock = new Stock('Test Stock Company', 'TSC', 85, 80);
    const diff = (this.stock.price / this.stock.previousPrice) - 1;
    const largeChange = Math.abs(diff) > 0.01;
    this.stockStyles = {
      color: this.stock.isPositiveChange() ? 'green' : 'red',
      'font-size': largeChange ? '1.2em' : '0.8em',
    };
  }

  toggleFavorite() {
    this.stock.favorite = !this.stock.favorite;
  }

}
