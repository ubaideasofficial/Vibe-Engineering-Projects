import { services } from '../../data/services';

const styles = [
  { name: 'Spatial UI', label: 'Dark layered industrial depth', kind: 'dark' },
  { name: 'Liquid Glass', label: 'Blurred floating panels', kind: 'dark' },
  { name: 'Bento Grid', label: 'Modular content surface', kind: 'dark' },
  { name: 'Skeuomorphism', label: 'Machined metal instrument panel', kind: 'light' },
  { name: 'Minimalism', label: 'Quiet editorial clarity', kind: 'light' },
  { name: 'Claymorphism', label: 'Soft rounded cards', kind: 'light' },
  { name: 'Neumorphism', label: 'Raised tactile surfaces', kind: 'light' },
  { name: 'Maximalism', label: 'Dense high-energy blocks', kind: 'dark' },
  { name: 'Brutalism', label: 'Hard borders and sharp shadow', kind: 'light' },
];

export const metadata = {
  title: 'Style Guide | AKMEC LLP',
  description: 'AKMEC design language guide covering all nine visual systems used across the brand.',
};

export default function StyleGuidePage() {
  return (
    <div className="bg-[var(--color-steel-050)] pt-24 pb-20 text-[var(--color-steel-900)]">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-safety)]">Brand Language</p>
          <h1 className="font-display text-4xl font-black uppercase tracking-[-0.05em] md:text-6xl">AKMEC Industrial OS</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {styles.map((style, index) => (
            <div
              key={style.name}
              className={[
                'rounded-[2rem] border p-6',
                style.kind === 'dark'
                  ? 'border-white/10 bg-[var(--color-steel-900)] text-white'
                  : 'border-black/5 bg-white text-[var(--color-steel-900)]',
              ].join(' ')}
              style={{
                boxShadow:
                  style.kind === 'dark'
                    ? '0 20px 60px rgba(10, 14, 20, 0.35)'
                    : '0 18px 45px rgba(20, 30, 50, 0.08)',
              }}
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-safety)]">#{index + 1}</span>
                <span className="rounded-full border border-current/20 px-2 py-1 text-[10px] uppercase tracking-[0.18em] opacity-70">
                  {style.kind}
                </span>
              </div>

              <h2 className="font-display text-2xl font-bold">{style.name}</h2>
              <p className="mt-3 text-sm opacity-80">{style.label}</p>

              <div className="mt-6 rounded-2xl border border-current/10 bg-[rgba(255,255,255,0.04)] p-4">
                <div className="flex gap-3">
                  <span className="h-3 w-3 rounded-full bg-[var(--color-safety)]" />
                  <span className="h-3 w-3 rounded-full bg-[var(--color-signal)]" />
                  <span className="h-3 w-3 rounded-full bg-[var(--color-warn)]" />
                </div>
                <div className="mt-4 h-16 rounded-xl bg-[rgba(255,255,255,0.04)]" />
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="h-10 rounded-lg bg-[rgba(255,255,255,0.08)]" />
                  <div className="h-10 rounded-lg bg-[rgba(255,255,255,0.06)]" />
                  <div className="h-10 rounded-lg bg-[rgba(255,255,255,0.08)]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] bg-[var(--color-steel-900)] p-8 text-white md:p-12">
          <h2 className="font-display text-3xl font-bold">Service blueprint</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <div key={service.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-safety)]">Service</p>
                <h3 className="mt-3 font-display text-xl font-bold">{service.title}</h3>
                <p className="mt-2 text-sm opacity-80">{service.shortDescription}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
