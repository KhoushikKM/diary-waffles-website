import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

type AnimationContext = {
  revert: () => void;
};

type NutritionFact = {
  label: string;
  value: string;
};

type NutritionValues = readonly [
  servingSize: string,
  energy: string,
  protein: string,
  carbohydrates: string,
  sugars: string,
  fat: string,
];

type ProductTab = 'description' | 'nutrition';

type ProductDefinition = {
  slug: string;
  name: string;
  image: string;
  color: string;
  textColor: string;
  accentColor: string;
  description: string;
  nutritionValues: NutritionValues;
};

type Product = {
  slug: string;
  name: string;
  image: string;
  color: string;
  textColor: string;
  accentColor: string;
  frames: string[];
  description: string;
  nutrition: NutritionFact[];
  previousPrice: number;
  price: number;
};

const waffleDetails: ProductDefinition[] = [
  {
    slug: 'matcha',
    name: 'Matcha',
    image: 'Matcha.png',
    color: '#718347',
    textColor: '#fffdf5',
    accentColor: '#e4edc9',
    description:
      'A bright, earthy matcha waffle layered with smooth green filling and silky cream. A white chocolate ribbon, pistachio crunch and a delicate snowfall of sugar make every bite feel rich, fragrant and beautifully balanced.',
    nutritionValues: ['~190 g waffle', '~520 kcal', '~10 g', '~62 g', '~31 g', '~26 g'],
  },
  {
    slug: 'triple-chocolate',
    name: 'Triple Chocolate',
    image: 'TripleChocolateWaffle.png',
    color: '#583b31',
    textColor: '#fff8ef',
    accentColor: '#eac9a5',
    description:
      'A cocoa-rich waffle stacked with three indulgent chocolate layers. Glossy dark and white chocolate drizzles, curls and crisp shavings bring a playful mix of creamy sweetness and deep cocoa flavour to every bite.',
    nutritionValues: ['~210 g waffle', '~640 kcal', '~11 g', '~75 g', '~44 g', '~32 g'],
  },
  {
    slug: 'lotus-crunch',
    name: 'Lotus Crunch',
    image: 'LotusWaffle.png',
    color: '#a86935',
    textColor: '#fffaf2',
    accentColor: '#f5dcad',
    description:
      'Golden, buttery waffle layers meet a smooth, creamy filling. Caramel ribbons and a generous Lotus biscuit crunch add a warmly spiced sweetness, with crisp edges and a soft centre in every delicious mouthful.',
    nutritionValues: ['~200 g waffle', '~610 kcal', '~10 g', '~75 g', '~41 g', '~29 g'],
  },
  {
    slug: 'pearl-white-meridian',
    name: 'Pearl White Meridian',
    image: 'PearlWaffle.png',
    color: '#c8b99a',
    textColor: '#403528',
    accentColor: '#fff5dd',
    description:
      'A golden waffle crowned with white chocolate curls and delicate ribbons, with chocolate squares tucked between its crisp pockets. A light dusting of sugar gives this soft, sweet creation its signature pearly finish.',
    nutritionValues: ['~195 g waffle', '~580 kcal', '~9 g', '~74 g', '~40 g', '~27 g'],
  },
  {
    slug: 'almond-crush',
    name: 'Almond Crush',
    image: 'AlmondWaffle.png',
    color: '#98704c',
    textColor: '#fffaf2',
    accentColor: '#f1d8b8',
    description:
      'Toasty almond slices and crunchy nut pieces crown a crisp golden waffle. Caramel drizzle brings a mellow buttery sweetness, while the smooth, creamy centre makes each crunchy, golden bite feel extra satisfying.',
    nutritionValues: ['~195 g waffle', '~600 kcal', '~13 g', '~69 g', '~34 g', '~31 g'],
  },
  {
    slug: 'white-chocolate-fest',
    name: 'White Chocolate Fest',
    image: 'WhiteChoco.png',
    color: '#d5c7aa',
    textColor: '#493b2c',
    accentColor: '#fff8e9',
    description:
      'Golden waffle layers are filled with a soft, creamy centre and dressed in silky white chocolate drizzle. Delicate curls and generous chocolate pieces add a lovely contrast of textures to this sweet, snowy celebration.',
    nutritionValues: ['~205 g waffle', '~640 kcal', '~10 g', '~76 g', '~45 g', '~33 g'],
  },
  {
    slug: 'blueberry-flush',
    name: 'Blueberry Flush',
    image: 'Blueberry.png',
    color: '#68718c',
    textColor: '#fffaf5',
    accentColor: '#e1e3f3',
    description:
      'A vibrant berry-purple waffle layered with blueberry cream and juicy berry compote. Fresh blueberries, white chocolate ribbons and a bright mint garnish bring a refreshing tang to this colourful, fruit-filled treat.',
    nutritionValues: ['~190 g waffle', '~520 kcal', '~9 g', '~70 g', '~33 g', '~22 g'],
  },
  {
    slug: 'butterscotch',
    name: 'Butterscotch',
    image: 'Buttersctch.png',
    color: '#a87538',
    textColor: '#fffaf2',
    accentColor: '#f4dfb2',
    description:
      'A golden waffle with a smooth, creamy centre and glossy butterscotch ribbons. Crunchy golden pieces scatter across its crisp pockets, adding a buttery caramel finish that is sweet, warm and wonderfully comforting.',
    nutritionValues: ['~195 g waffle', '~600 kcal', '~9 g', '~78 g', '~43 g', '~28 g'],
  },
  {
    slug: 'dark-chocolate',
    name: 'Dark Chocolate',
    image: 'darkChocolate.png',
    color: '#402b25',
    textColor: '#fff8ef',
    accentColor: '#e2c29a',
    description:
      'Deep cocoa waffle layers meet a rich chocolate filling and glossy dark chocolate ribbons. Generous chocolate shards add a satisfying crunch, making this a bold, bittersweet treat for anyone who loves intense cocoa flavour.',
    nutritionValues: ['~205 g waffle', '~640 kcal', '~11 g', '~70 g', '~39 g', '~36 g'],
  },
  {
    slug: 'cookie-and-creme',
    name: 'Cookie and Creme',
    image: 'cookieNcreme.png',
    color: '#817767',
    textColor: '#fffaf4',
    accentColor: '#eee3d2',
    description:
      'Golden waffle layers are filled with cookies-and-cream, then topped with crushed chocolate cookies and glossy chocolate drizzle. Each bite pairs a crisp waffle edge with a cool, creamy middle and plenty of cookie crunch.',
    nutritionValues: ['~205 g waffle', '~650 kcal', '~10 g', '~78 g', '~46 g', '~34 g'],
  },
];

const drinkDetails: ProductDefinition[] = [
  {
    slug: 'pumpkin-spice-latte',
    name: 'Pumpkin Spice Latte',
    image: 'PumpkinSpiceLatte.png',
    color: '#a66f4c',
    textColor: '#fff8ed',
    accentColor: '#f4d2a7',
    description:
      'A cozy espresso latte blended with smooth milk and warming pumpkin spice. Gently sweet, softly spiced and finished with a creamy top, it is the kind of comforting cup made for a slow sip.',
    nutritionValues: ['~350 ml', '~230 kcal', '~9 g', '~34 g', '~29 g', '~6 g'],
  },
  {
    slug: 'matcha-shake',
    name: 'Matcha Shake',
    image: 'MatchaShake.png',
    color: '#75835a',
    textColor: '#fffdf5',
    accentColor: '#e5edc7',
    description:
      'Earthy matcha meets chilled milk and a smooth, creamy shake for a refreshing balance of mellow sweetness and green-tea flavour. A cool treat for matcha lovers, whether you are taking a break or pairing it with a waffle.',
    nutritionValues: ['~350 ml', '~390 kcal', '~9 g', '~56 g', '~44 g', '~14 g'],
  },
  {
    slug: 'iced-latte',
    name: 'Iced Latte',
    image: 'IcedLatte.png',
    color: '#b59a79',
    textColor: '#403528',
    accentColor: '#fff0d6',
    description:
      'A simple, refreshing classic: smooth espresso poured over chilled milk and ice. Lightly sweet and easy to enjoy, it brings a cool coffee lift without taking away from the gentle roasted flavour.',
    nutritionValues: ['~350 ml', '~140 kcal', '~8 g', '~14 g', '~12 g', '~6 g'],
  },
  {
    slug: 'chocolate-milkshake',
    name: 'Chocolate Milkshake',
    image: 'ChocolateMilkshake.png',
    color: '#63463d',
    textColor: '#fff8ef',
    accentColor: '#eac9a5',
    description:
      'A thick, chilled milkshake blended with creamy milk and rich chocolate. Smooth, satisfying and topped for an extra-special finish, it is a timeless chocolate treat in every sip.',
    nutritionValues: ['~350 ml', '~420 kcal', '~11 g', '~60 g', '~49 g', '~15 g'],
  },
  {
    slug: 'butterscotch-milkshake',
    name: 'Butterscotch Milkshake',
    image: 'ButterscotchMilkshake.png',
    color: '#a77b45',
    textColor: '#fffaf1',
    accentColor: '#f5dfb6',
    description:
      'A creamy, ice-cold shake swirled with buttery butterscotch flavour. Sweet caramel notes and a silky finish make this an easy favourite for anyone craving a little dessert in their drink.',
    nutritionValues: ['~350 ml', '~450 kcal', '~10 g', '~66 g', '~55 g', '~16 g'],
  },
];

const createProduct = (product: ProductDefinition, category: 'waffle' | 'drinks'): Product => ({
  ...product,
  frames: [`/pics/${category}/${product.image}`],
  nutrition: [
    { label: 'Serving size', value: product.nutritionValues[0] },
    { label: 'Energy', value: product.nutritionValues[1] },
    { label: 'Protein', value: product.nutritionValues[2] },
    { label: 'Carbohydrates', value: product.nutritionValues[3] },
    { label: 'Sugars', value: product.nutritionValues[4] },
    { label: 'Fat', value: product.nutritionValues[5] },
  ],
  previousPrice: 249,
  price: 199,
});

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements AfterViewInit, OnDestroy {
  protected readonly navVisible = signal(true);
  protected readonly productTabs = signal<Record<string, ProductTab>>({});
  protected readonly activeFlavourIndex = signal(0);
  protected readonly activeDrinkIndex = signal(0);
  protected readonly flavours: Product[] = waffleDetails.map((product) =>
    createProduct(product, 'waffle'),
  );
  protected readonly drinks: Product[] = drinkDetails.map((product) =>
    createProduct(product, 'drinks'),
  );

  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);
  private lastScrollY = 0;
  private animationContext: AnimationContext | null = null;
  private reducedMotionObserver: IntersectionObserver | null = null;
  private destroyed = false;

  @HostListener('window:scroll')
  protected updateNavVisibility(): void {
    const scrollY = window.scrollY;
    this.navVisible.set(scrollY <= 24 || scrollY < this.lastScrollY);
    this.lastScrollY = scrollY;
    this.activeFlavourIndex.set(this.closestPanelIndex('.flavour-panel'));
    this.activeDrinkIndex.set(this.closestPanelIndex('.drink-panel'));
  }

  protected setProductTab(slug: string, tab: ProductTab): void {
    this.productTabs.update((tabs) => ({ ...tabs, [slug]: tab }));
  }

  private closestPanelIndex(selector: string): number {
    const panels = this.host.nativeElement.querySelectorAll<HTMLElement>(selector);
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    panels.forEach((panel, index) => {
      const bounds = panel.getBoundingClientRect();
      const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const [{ gsap }, { ScrollTrigger }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);

    if (this.destroyed) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const root = this.host.nativeElement;
    this.activeFlavourIndex.set(this.closestPanelIndex('.flavour-panel'));
    this.activeDrinkIndex.set(this.closestPanelIndex('.drink-panel'));

    this.animationContext = gsap.context(() => {
      const wafflePanels = Array.from(root.querySelectorAll<HTMLElement>('.flavour-panel'));
      const waffleLayers = Array.from(
        root.querySelectorAll<HTMLElement>('.waffle-stage .waffle-layer'),
      );
      const drinkPanels = Array.from(root.querySelectorAll<HTMLElement>('.drink-panel'));
      const drinkLayers = Array.from(root.querySelectorAll<HTMLElement>('.drink-stage .drink-layer'));
      const allLayers = [...waffleLayers, ...drinkLayers];
      gsap.set(allLayers, { autoAlpha: 0, y: 0, scale: 0.72, rotation: 0 });

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const allPanels = [...wafflePanels, ...drinkPanels];
        this.reducedMotionObserver = new IntersectionObserver(
          (entries) => {
            const activePanel = entries
              .filter((entry) => entry.isIntersecting)
              .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (!activePanel) {
              return;
            }

            const index = Number(activePanel.target.getAttribute('data-product-index'));
            const layers = activePanel.target.classList.contains('drink-panel')
              ? drinkLayers
              : waffleLayers;
            const activeLayer = layers[index];

            if (!activeLayer) {
              return;
            }

            gsap.set(allLayers, { autoAlpha: 0 });
            gsap.set(activeLayer, { autoAlpha: 1, y: 0, scale: 0.72, rotation: 0 });
          },
          { threshold: 0.55 },
        );

        allPanels.forEach((panel) => this.reducedMotionObserver?.observe(panel));
        return;
      }

      const animateProducts = (panels: HTMLElement[], layers: HTMLElement[]): void => {
        panels.forEach((panel, index) => {
          const layer = layers[index];

          if (!layer) {
            return;
          }

          const frames = Array.from(layer.querySelectorAll<HTMLImageElement>('.product-frame'));
          const updateFrames = (progress: number): void => {
            if (frames.length === 0) {
              return;
            }

            const framePosition =
              gsap.utils.clamp(0, 1, (progress - 0.12) / 0.76) * (frames.length - 1);
            const firstFrame = Math.floor(framePosition);
            const secondFrame = Math.min(firstFrame + 1, frames.length - 1);
            const blend = framePosition - firstFrame;

            frames.forEach((frame, frameIndex) => {
              const opacity =
                frameIndex === firstFrame
                  ? 1 - blend
                  : frameIndex === secondFrame
                    ? blend
                    : 0;
              frame.style.opacity = String(opacity);
              frame.style.visibility = opacity > 0 ? 'visible' : 'hidden';
            });
          };

          updateFrames(0);

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: panel,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.45,
              invalidateOnRefresh: true,
              onUpdate: (trigger) => {
                updateFrames(trigger.progress);
              },
            },
          });

          timeline
            .fromTo(
              layer,
              {
                autoAlpha: 0,
                y: () => -window.innerHeight * 0.75,
                scale: 0.56,
                rotation: -8,
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1.16,
                rotation: 0,
                duration: 0.42,
                ease: 'none',
              },
            )
            .to(layer, {
              autoAlpha: 1,
              y: 0,
              scale: 1.16,
              duration: 0.16,
              ease: 'none',
            })
            .to(layer, {
              autoAlpha: 0,
              y: () => window.innerHeight * 1.05,
              scale: 0.5,
              rotation: 8,
              duration: 0.42,
              ease: 'none',
            });
        });
      };

      animateProducts(wafflePanels, waffleLayers);
      animateProducts(drinkPanels, drinkLayers);
    }, root);

    ScrollTrigger.refresh();
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.animationContext?.revert();
    this.reducedMotionObserver?.disconnect();
  }
}
