import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lander',
  imports: [RouterLink],
  templateUrl: './lander.html',
  styleUrl: './lander.css',
})
export class Lander {
  protected readonly navVisible = signal(true);
  private lastScrollY = 0;

  protected readonly reviews = [
    {
      name: 'Maya R.',
      rating: 5,
      quote: 'The warm waffles and cozy atmosphere made our Sunday feel special.',
    },
    {
      name: 'Daniel K.',
      rating: 4,
      quote: 'Crispy on the outside, fluffy in the middle. I’ll definitely be back!',
    },
    {
      name: 'Priya S.',
      rating: 5,
      quote: 'A little taste of comfort in every bite. The berry waffle is a dream.',
    },
    {
      name: 'Leo M.',
      rating: 5,
      quote: 'Lovely people, lovely coffee, and the best waffles in the neighborhood.',
    },
    {
      name: 'Amelia T.',
      rating: 4,
      quote: 'Fresh, delicious, and beautifully made. Perfect for a weekend treat.',
    },
  ];

  @HostListener('window:scroll')
  protected updateNavVisibility(): void {
    const scrollY = window.scrollY;
    this.navVisible.set(scrollY <= 24 || scrollY < this.lastScrollY);
    this.lastScrollY = scrollY;
  }
}