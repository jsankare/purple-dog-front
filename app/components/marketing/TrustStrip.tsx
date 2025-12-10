export default function TrustStrip() {
  const items = [
    { title: "Vendeurs vérifiés", subtitle: "Sélection et validation par nos experts", icon: 'shield' },
    { title: "Paiement sécurisé", subtitle: "Transactions protégées et garanties", icon: 'card' },
    { title: "Livraison assurée", subtitle: "Expédition suivie partout en France", icon: 'truck' },
    { title: "Assistance experte", subtitle: "Conseils et support personnalisé", icon: 'headset' },
  ];

  function Icon({ name }: { name: string }) {
    if (name === 'shield')
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l7 3v5c0 5-3.5 9.7-7 11-3.5-1.3-7-6-7-11V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    if (name === 'card')
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    if (name === 'truck')
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 8h4l3 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="7" cy="20" r="1" fill="currentColor" />
          <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
      );
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 18v-6a9 9 0 0118 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <div className="rounded-app border-subtle surface px-3 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center gap-3 justify-center p-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-brand/10 text-brand">
                <Icon name={it.icon} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{it.title}</div>
                <div className="text-muted text-xs">{it.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
