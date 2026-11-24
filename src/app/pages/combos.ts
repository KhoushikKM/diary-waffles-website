import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';

type ComboChoice = {
  slug: string;
  name: string;
  image: string;
};

type Picker = 'waffle' | 'drink';

const waffles: ComboChoice[] = [
  { slug: 'matcha', name: 'Matcha', image: 'Matcha.png' },
  { slug: 'triple-chocolate', name: 'Triple Chocolate', image: 'TripleChocolateWaffle.png' },
  { slug: 'lotus-crunch', name: 'Lotus Crunch', image: 'LotusWaffle.png' },
  { slug: 'pearl-white-meridian', name: 'Pearl White Meridian', image: 'PearlWaffle.png' },
  { slug: 'almond-crush', name: 'Almond Crush', image: 'AlmondWaffle.png' },
  { slug: 'white-chocolate-fest', name: 'White Chocolate Fest', image: 'WhiteChoco.png' },
  { slug: 'blueberry-flush', name: 'Blueberry Flush', image: 'Blueberry.png' },
  { slug: 'butterscotch', name: 'Butterscotch', image: 'Buttersctch.png' },
  { slug: 'dark-chocolate', name: 'Dark Chocolate', image: 'darkChocolate.png' },
  { slug: 'cookie-and-creme', name: 'Cookie and Creme', image: 'cookieNcreme.png' },
];

const drinks: ComboChoice[] = [
  { slug: 'pumpkin-spice-latte', name: 'Pumpkin Spice Latte', image: 'PumpkinSpiceLatte.png' },
  { slug: 'matcha-shake', name: 'Matcha Shake', image: 'MatchaShake.png' },
  { slug: 'iced-latte', name: 'Iced Latte', image: 'IcedLatte.png' },
  { slug: 'chocolate-milkshake', name: 'Chocolate Milkshake', image: 'ChocolateMilkshake.png' },
  {
    slug: 'butterscotch-milkshake',
    name: 'Butterscotch Milkshake',
    image: 'ButterscotchMilkshake.png',
  },
];

@Component({
  selector: 'app-combos',
  templateUrl: './combos.html',
  styleUrl: './combos.css',
})
export class Combos {
  private readonly host = inject(ElementRef<HTMLElement>);
  protected readonly waffles = waffles;
  protected readonly drinks = drinks;
  protected readonly activePicker = signal<Picker | null>(null);
  protected readonly selectedWaffle = signal<ComboChoice | null>(null);
  protected readonly selectedDrink = signal<ComboChoice | null>(null);

  protected openPicker(picker: Picker): void {
    this.activePicker.set(picker);
    window.setTimeout(() => {
      const closeButton = this.host.nativeElement.querySelector('.close-picker');

      if (closeButton instanceof HTMLButtonElement) {
        closeButton.focus();
      }
    });
  }

  protected closePicker(): void {
    const picker = this.activePicker();

    if (!picker) {
      return;
    }

    this.activePicker.set(null);
    window.setTimeout(() => {
      const choiceButton = this.host.nativeElement.querySelector(`#combo-choice-${picker}`);

      if (choiceButton instanceof HTMLButtonElement) {
        choiceButton.focus();
      }
    });
  }

  protected selectWaffle(waffle: ComboChoice): void {
    this.selectedWaffle.set(waffle);
    this.closePicker();
  }

  protected selectDrink(drink: ComboChoice): void {
    this.selectedDrink.set(drink);
    this.closePicker();
  }

  protected placeOrder(): void {
    this.selectedWaffle.set(null);
    this.selectedDrink.set(null);
    this.closePicker();
  }

  @HostListener('document:keydown.escape')
  protected closePickerOnEscape(): void {
    this.closePicker();
  }
}
