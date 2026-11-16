import { useEffect, useMemo, useState } from 'react';
import {
  Button, IconButton, Tag, StatusBadge, SegmentedControl, ChipGroup, Stepper, TextField, TextArea,
  DateStrip, TimeSlots, nextDays, venueDateKey, buildSlots, StrengthMeter, MenuSection, MenuItem, PriceTable,
  Card, Glass, MediaCard, NavBar, TabBar, Logo, tokens, formatPrice,
  JellyfishIcon, CalendarIcon, ClockIcon, GuestsIcon, LocationIcon, PhoneIcon, MessageIcon, LeafIcon, ChiliIcon,
  HookahIcon, GlassIcon, MenuBookIcon, ChevronRightIcon, GlobeIcon,
} from '../src';
import type { Locale, Mood, ThemeName } from '../src';

const photo = (n: string) => `/photos/${n}.jpg`;

export function App() {
  const [theme, setTheme] = useState<ThemeName>('abyss');
  const [mood, setMood] = useState<Mood>('glow');
  const [locale, setLocale] = useState<Locale>('en');
  const [exp, setExp] = useState<'brunch' | 'dining' | 'lounge'>('lounge');
  const [cat, setCat] = useState('signature');
  const [guests, setGuests] = useState(2);
  const days = useMemo(() => nextDays(14), []);
  const [day, setDay] = useState(venueDateKey(days[1]));
  const [slot, setSlot] = useState<string | null>('20:30');
  const [contact, setContact] = useState<'telegram' | 'zalo' | 'phone' | 'instagram'>('telegram');

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = theme;
    if (mood === 'lantern') el.dataset.mood = 'lantern'; else delete el.dataset.mood;
    el.lang = locale;
  }, [theme, mood, locale]);

  const all = buildSlots('18:00', '23:30');
  const full = new Set(['20:00', '21:00']);
  const toSlot = (t: string) => ({ time: t, available: !full.has(t) });

  const themeColors = Object.entries(tokens.theme[theme]).filter(([, v]) => !String(v).startsWith('linear'));

  return (
    <>
      {/* Hero */}
      <header className="sg-hero">
        <img src={photo('tank')} alt="" />
        <div style={{ padding: '20px var(--mz-space-page-x) 0' }}>
          <NavBar
            brand={<Logo height={34} />}
            links={[
              { href: '#color', label: 'Color', current: true },
              { href: '#type', label: 'Type' },
              { href: '#controls', label: 'Controls' },
              { href: '#booking', label: 'Booking' },
              { href: '#menu', label: 'Menu' },
            ]}
            actions={<Button size="sm" href="#booking">Book a table</Button>}
          />
        </div>
        <div className="mz-container mz-stack" style={{ marginTop: 'auto', paddingBottom: 72, ['--mz-gap' as string]: '20px' }}>
          <span className="mz-eyebrow">Design system · v1.0</span>
          <h1 className="mz-display" style={{ color: 'var(--mz-color-mist-100)' }}>
            Abyss <em className="mz-accent-serif" style={{ color: 'var(--mz-color-lantern-400)' }}>&amp;</em> Lantern
          </h1>
          <p className="mz-body" style={{ margin: 0, maxWidth: 600, color: 'var(--mz-color-mist-200)', fontSize: 20 }}>
            Tokens, styles and React components for Meduza — Cocktails &amp; Cuisine, Nha Trang.
          </p>
        </div>
      </header>

      <main className="mz-container">
        {/* Toolbar */}
        <div className="sg-toolbar">
          <Glass style={{ borderRadius: 'var(--mz-radius-pill)', padding: 8, display: 'flex', flexWrap: 'wrap', gap: 8, width: 'fit-content' }}>
            <SegmentedControl label="Theme" size="sm" value={theme} onChange={setTheme}
              options={[{ value: 'abyss', label: 'Abyss' }, { value: 'pearl', label: 'Pearl' }]} />
            <SegmentedControl label="Mood" size="sm" value={mood} onChange={setMood}
              options={[{ value: 'glow', label: 'Glow' }, { value: 'lantern', label: 'Lantern' }]} />
            <SegmentedControl label="Language" size="sm" value={locale} onChange={setLocale}
              options={[{ value: 'en', label: 'EN' }, { value: 'ru', label: 'RU' }, { value: 'vi', label: 'VI' }]} />
          </Glass>
        </div>

        {/* Color */}
        <section id="color" className="sg-section">
          <div className="sg-head">
            <div className="mz-stack" style={{ ['--mz-gap' as string]: '8px' }}>
              <span className="mz-eyebrow">01 · Color</span>
              <h2 className="mz-title-1">Semantic colors — {theme === 'abyss' ? 'Abyss' : 'Pearl'}</h2>
            </div>
            <p className="mz-callout mz-secondary">Use these <code>var(--mz-*)</code> roles in product code, never raw hex. Switch theme and mood above — everything re-skins.</p>
          </div>
          <div className="sg-swatches">
            {themeColors.map(([name]) => (
              <div key={name} className="sg-swatch">
                <div className="sg-swatch__chip" style={{ background: `var(--mz-${name})` }} />
                <span className="mz-footnote" style={{ fontWeight: 600 }}>{name}</span>
                <code>--mz-{name}</code>
              </div>
            ))}
          </div>
        </section>

        {/* Type */}
        <section id="type" className="sg-section">
          <div className="sg-head">
            <div className="mz-stack" style={{ ['--mz-gap' as string]: '8px' }}>
              <span className="mz-eyebrow">02 · Typography</span>
              <h2 className="mz-title-1">Inter Tight, Inter, <em className="mz-accent-serif">Instrument Serif</em></h2>
            </div>
            <p className="mz-callout mz-secondary">All three cover Latin, Vietnamese and Cyrillic. Serif italic: one phrase per screen, never UI.</p>
          </div>
          <div>
            {[
              ['display', 'Smoke. Sip.'], ['title-1', 'Into the deep'], ['title-2', 'Signature cocktails'],
              ['title-3', 'Ribeye Steak / Bourbon Sauce'], ['headline', 'Eyes of Meduza'],
              ['body', 'Black rum, tea leaf, hibiscus, amaro and black walnut.'], ['callout', 'Đầu Thăn Ngoại Bò Úc / Sốt Bourbon'],
              ['footnote', 'Прайс включает НДС 10%'],
            ].map(([k, sample]) => (
              <div key={k} className="sg-type-row">
                <code className="mz-footnote mz-secondary">.mz-{k}</code>
                <span className={`mz-${k}`}>{sample}</span>
              </div>
            ))}
            <div className="sg-type-row">
              <code className="mz-footnote mz-secondary">.mz-eyebrow</code>
              <span className="mz-eyebrow">Open daily · 12:00 – 02:00</span>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section id="controls" className="sg-section">
          <div className="sg-head">
            <div className="mz-stack" style={{ ['--mz-gap' as string]: '8px' }}>
              <span className="mz-eyebrow">03 · Controls</span>
              <h2 className="mz-title-1">Buttons, tags, switches</h2>
            </div>
            <p className="mz-callout mz-secondary">All controls are ≥ 44 px, pill-shaped and keyboard-operable. One filled button per view.</p>
          </div>
          <div className="mz-grid" style={{ ['--mz-min' as string]: '420px' }}>
            <Card className="mz-stack" style={{ ['--mz-gap' as string]: '20px' }}>
              <span className="mz-footnote mz-secondary">Button</span>
              <div className="mz-row">
                <Button glow>Book a table</Button>
                <Button variant="secondary">View menu</Button>
                <Button variant="ghost" iconEnd={<ChevronRightIcon size={16} />}>Directions</Button>
              </div>
              <div className="mz-row">
                <Button size="sm" variant="inverse">Add to calendar</Button>
                <Button size="sm" disabled>Disabled</Button>
                <IconButton aria-label="Call Meduza"><PhoneIcon size={20} /></IconButton>
                <IconButton aria-label="Open map"><LocationIcon size={20} /></IconButton>
              </div>
            </Card>
            <Card className="mz-stack" style={{ ['--mz-gap' as string]: '20px' }}>
              <span className="mz-footnote mz-secondary">Tag &amp; status</span>
              <div className="mz-row">
                <StatusBadge open>Open now · until 02:00</StatusBadge>
                <Tag tone="accent">Signature</Tag>
                <Tag tone="secondary">Chef’s pick</Tag>
                <Tag icon={<LeafIcon size={14} style={{ color: 'var(--mz-success)' }} />}>Vegetarian</Tag>
                <Tag icon={<ChiliIcon size={14} style={{ color: 'var(--mz-danger)' }} />}>Spicy</Tag>
              </div>
              <span className="mz-footnote mz-secondary">Strength</span>
              <div className="mz-row" style={{ ['--mz-gap' as string]: '24px' }}>
                <StrengthMeter level={1} showLabel showScale locale={locale} />
                <StrengthMeter level={2} showLabel showScale locale={locale} />
                <StrengthMeter level={3} showLabel showScale locale={locale} />
              </div>
            </Card>
            <Card className="mz-stack" style={{ ['--mz-gap' as string]: '20px' }}>
              <span className="mz-footnote mz-secondary">SegmentedControl · role="tabs"</span>
              <SegmentedControl label="Experience" role="tabs" value={exp} onChange={setExp}
                options={[{ value: 'brunch', label: 'Brunch' }, { value: 'dining', label: 'Dining' }, { value: 'lounge', label: 'Lounge' }]} />
              <span className="mz-footnote mz-secondary">ChipGroup</span>
              <ChipGroup label="Category" value={cat} onChange={setCat}
                options={[{ value: 'signature', label: 'Signature' }, { value: 'classic', label: 'Classic' }, { value: 'wine', label: 'Wine' }, { value: 'whisky', label: 'Whisky' }, { value: 'tea', label: 'Tea & coffee' }]} />
            </Card>
            <Card className="mz-stack" style={{ ['--mz-gap' as string]: '20px' }}>
              <span className="mz-footnote mz-secondary">Icons · 24 grid · 1.5 stroke</span>
              <div className="mz-row" style={{ ['--mz-gap' as string]: '20px' }}>
                {[JellyfishIcon, CalendarIcon, ClockIcon, GuestsIcon, LocationIcon, PhoneIcon, MessageIcon, HookahIcon, GlassIcon, MenuBookIcon, GlobeIcon].map((I, i) => <I key={i} size={28} />)}
              </div>
            </Card>
          </div>
        </section>

        {/* Booking */}
        <section id="booking" className="sg-section">
          <div className="sg-head">
            <div className="mz-stack" style={{ ['--mz-gap' as string]: '8px' }}>
              <span className="mz-eyebrow">04 · Booking kit</span>
              <h2 className="mz-title-1">Book a <em className="mz-accent-serif">table</em></h2>
            </div>
            <p className="mz-callout mz-secondary">DateStrip, TimeSlots, Stepper and fields compose the booking flow. Times are Vietnam time (GMT+7).</p>
          </div>
          <div className="mz-grid" style={{ ['--mz-min' as string]: '420px', alignItems: 'start' }}>
            <Card className="mz-stack" style={{ ['--mz-gap' as string]: '20px' }}>
              <DateStrip days={days} value={day} onChange={setDay} locale={locale} />
              <TimeSlots value={slot} onChange={setSlot} groups={[
                { label: 'Evening', slots: all.filter((t) => t < '21:00').map(toSlot) },
                { label: 'Late', slots: all.filter((t) => t >= '21:00').map(toSlot) },
              ]} />
              <Stepper label="Guests" value={guests} onChange={setGuests} />
            </Card>
            <Card className="mz-stack" style={{ ['--mz-gap' as string]: '16px' }}>
              <TextField label="Name" autoComplete="name" placeholder="Your name" />
              <TextField label="Phone" type="tel" autoComplete="tel" defaultValue="+84 90" error="Enter a full number so the hostess can confirm." />
              <div className="mz-stack" style={{ ['--mz-gap' as string]: '8px' }}>
                <span className="mz-footnote mz-secondary">Confirm my booking via</span>
                <SegmentedControl label="Preferred contact" value={contact} onChange={setContact} size="sm"
                  options={[{ value: 'telegram', label: 'Telegram' }, { value: 'zalo', label: 'Zalo' }, { value: 'phone', label: 'Phone' }, { value: 'instagram', label: 'Instagram' }]} />
              </div>
              <TextArea label="Special requests" optional placeholder="Birthday, hookah ready on arrival, allergies…" />
              <Button block size="lg" glow>Request booking</Button>
            </Card>
          </div>
        </section>

        {/* Menu */}
        <section id="menu" className="sg-section">
          <div className="sg-head">
            <div className="mz-stack" style={{ ['--mz-gap' as string]: '8px' }}>
              <span className="mz-eyebrow">05 · Menu kit</span>
              <h2 className="mz-title-1">Menu rows &amp; price tables</h2>
            </div>
            <p className="mz-callout mz-secondary">Prices format per language: {formatPrice(260000, 'en')} · {formatPrice(260000, 'ru')} · {formatPrice(260000, 'vi')}</p>
          </div>
          <div className="mz-grid" style={{ ['--mz-min' as string]: '460px', alignItems: 'start' }}>
            <MenuSection title="Signature cocktails" subtitle="Cocktail đặc trưng" note="10% VAT incl.">
              <MenuItem locale={locale} name="Eyes of Meduza" description="Vodka · citrus · blue" price={280000} strength={2} badge={<Tag tone="accent" size="sm">Signature</Tag>} />
              <MenuItem locale={locale} name="The Siren Secret" description="Whisky · coffee bean · tiramisu" price={260000} strength={3} />
              <MenuItem locale={locale} name="Neptune’s Kiss" description="Vodka · guava · shiso · citrus" price={260000} strength={1} />
              <MenuItem locale={locale} name="Sweet Potato Fries / Curry Sauce" localName="Khoai Lang Chiên / Sốt Cà Ri (Chay)" price={90000} vegetarian />
              <MenuItem locale={locale} name="Shrimp Popcorn / Spicy Mango Sauce" localName="Tôm Chiên Giòn / Sốt Xoài Cay" price={220000} spicy />
            </MenuSection>
            <MenuSection title="Gin" subtitle="Rượu gin">
              <PriceTable locale={locale} caption="Gin prices" columns={['Shot 45 ml', 'Bottle 700 ml']} rows={[
                { name: 'Roku', prices: [200000, 2890000] },
                { name: 'Hendrick’s', prices: [220000, 3590000] },
                { name: 'Monkey 47', prices: [380000, 5090000] },
                { name: 'Lady Triệu', prices: [200000, null] },
                { name: 'Sông Cái', prices: [220000, 2390000] },
              ]} />
            </MenuSection>
          </div>
        </section>

        {/* Cards & nav */}
        <section className="sg-section">
          <div className="sg-head">
            <div className="mz-stack" style={{ ['--mz-gap' as string]: '8px' }}>
              <span className="mz-eyebrow">06 · Surfaces</span>
              <h2 className="mz-title-1">Media cards &amp; navigation</h2>
            </div>
          </div>
          <div className="mz-grid" style={{ ['--mz-min' as string]: '300px' }}>
            <MediaCard href="#" mood="lantern" image={photo('lotus2')} imageAlt="Lotus sculpture and rattan chairs in the dining room" eyebrow="Brunch" title="Slow mornings" text="Focaccia, tartare and coconut coffee under the lotus." height={440} />
            <MediaCard href="#" mood="lantern" image={photo('roundtable')} imageAlt="Round table between bead curtains" eyebrow="Dining" title="Fine dining" text="Ribeye with bourbon sauce, wines from four countries." height={440} />
            <MediaCard href="#" image={photo('lounge')} imageAlt="Lounge with velvet sofas and neon sign" eyebrow="Lounge · until 02:00" title="Hookah & cocktails" text="Four hookah blends and a long blue bar." height={440} />
          </div>
          <div className="mz-row" style={{ alignItems: 'flex-start', ['--mz-gap' as string]: '24px' }}>
            <div className="sg-phone">
              <TabBar items={[
                { href: '#', label: 'Meduza', icon: <JellyfishIcon size={22} />, current: true },
                { href: '#menu', label: 'Menu', icon: <MenuBookIcon size={22} /> },
                { href: '#booking', label: 'Book', icon: <CalendarIcon size={22} /> },
                { href: '#', label: 'Visit', icon: <LocationIcon size={22} /> },
              ]} />
            </div>
            <Card style={{ flex: '1 1 320px' }} className="mz-stack">
              <Logo tone={theme === 'abyss' ? 'light' : 'dark'} height={64} />
              <span className="mz-footnote mz-secondary">Logo — light mark on Abyss, ink mark on Pearl. Replace with the vector master when it arrives.</span>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
