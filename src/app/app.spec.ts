import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { Lander } from './pages/lander';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, Lander],
      providers: [provideRouter(routes)],
    })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the landing page and its navigation', async () => {
    const fixture = TestBed.createComponent(Lander);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Mooo-d for something sweet?');
    expect(compiled.querySelector('.hero-logo')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/menu"]')?.textContent).toContain('Menu');
    expect(compiled.querySelector('.favorites-art')).toBeTruthy();
    expect(compiled.querySelector('a[routerLink="/combos"]')?.textContent).toContain('Try combos');
    expect(compiled.querySelector('#feedback')).toBeTruthy();
  });
});
