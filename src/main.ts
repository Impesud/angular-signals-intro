/*
Introduction to using Signals in Angular 16
Follow us: https://github.com/Impesud
*/
import 'zone.js/dist/zone';
import {
  Component,
  computed,
  effect,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'angular-signals-app',
  standalone: true,
  imports: [CommonModule,FormsModule],
  template: `
    <h1>Shopping Cart</h1>
      <select
        [ngModel]="quantity()"
        (change)="onQuantitySelected($any($event.target).value)">
        <option disabled value="">--Select a quantity--</option>
        <option *ngFor="let q of qtyAvailable()">{{ q }}</option>
      </select>
      <div>Ship: {{ selectedShip().name}}</div>
      <div>Price: {{ selectedShip().price | number: '1.2-2'}}</div>
      <div style="font-weight: bold" [style.color]="color()">Total: {{ totalPrice()  | number: '1.2-2' }}</div>
      <div *ngFor="let v of ships()">List of ships: {{ v.name }}</div>`
  ,
})
export class App {
  quantity = signal<number>(1);
  qtyAvailable = signal([1, 2, 3, 4, 5, 6]);

  selectedShip = signal<Ship>({
     id: 1, name: 'Nazca', price: 10000 
  });

  ships = signal<Ship[]>([]);

  totalPrice = computed(() => this.selectedShip().price * this.quantity());
  color = computed(() => this.totalPrice() > 50000 ? 'red' : 'blue');

  constructor() {
    
    //Print the initial quantity
    console.log(this.quantity());

    // Default quantity
    this.quantity.update((qty) => qty * 3);

    // Interstellar price increase
    this.selectedShip.mutate((v) => v.price = v.price + (v.price * 0.2));

    // Add selected ship to array
    this.ships.mutate(v => v.push(this.selectedShip()))

    // Example of an effect
    effect(() => console.log(JSON.stringify(this.ships())));
  }

  // Example of a declarative effect
  qtyEff = effect(() => console.log("Latest quantity:", this.quantity()));

  onQuantitySelected(qty: number) {
    this.quantity.set(qty);

    // Does not "emit" values, rather updates the value in the "box"
    // this.quantity.set(5);
    // this.quantity.set(42);

    // Add the ship to the array again ... to see the effect execute
    //this.ships.mutate(v => v.push(this.selectedShip()))
  }
}

export interface Ship {
  id: number;
  name: string;
  price: number;
}

bootstrapApplication(App);
