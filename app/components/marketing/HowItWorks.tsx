export default function HowItWorks() {
  const steps = [
    {
      icon: 'user-plus',
      title: 'Créez un compte',
      desc: 'Inscrivez-vous gratuitement en quelques clics.'
    },
    {
      icon: 'search',
      title: 'Faites estimer',
      desc: 'Recevez une estimation par nos experts pour vos objets.'
    },
    {
      icon: 'upload',
      title: 'Mettez en vente',
      desc: 'Publiez votre objet, Purple Dog le met en avant auprès des pros.'
    },
    {
      icon: 'gavel',
      title: 'Les pros achètent',
      desc: 'Des professionnels enchérissent ou achètent directement.'
    },
  ];
  function Icon({ name }: { name: string }) {
    if (name === 'user-plus')
      return (<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/><path d="M4 20c0-2.5 3-4.5 8-4.5s8 2 8 4.5" stroke="currentColor" strokeWidth="1.5"/><path d="M19 7v4m2-2h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>);
    if (name === 'search')
      return (<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M20 20l-3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>);
    if (name === 'upload')
      return (<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 17V7m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="17" width="16" height="2" rx="1" fill="currentColor" opacity=".1"/></svg>);
    if (name === 'gavel')
      return (<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect x="13.5" y="3.5" width="7" height="2" rx="1" transform="rotate(45 13.5 3.5)" stroke="currentColor" strokeWidth="1.5"/><rect x="3.5" y="13.5" width="7" height="2" rx="1" transform="rotate(-45 3.5 13.5)" stroke="currentColor" strokeWidth="1.5"/><path d="M8 16l8-8" stroke="currentColor" strokeWidth="1.5"/><rect x="4" y="20" width="16" height="2" rx="1" fill="currentColor" opacity=".1"/></svg>);
    return null;
  }
  return (
    <div className="py-10">
      <div className="max-w-4xl mx-auto">
        <h2 className="h3 text-center mb-8">Comment ça marche&nbsp;?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center p-4 rounded-app border-subtle surface">
              <div className="mb-3 text-brand"> <Icon name={step.icon} /> </div>
              <div className="font-semibold mb-1">{step.title}</div>
              <div className="text-xs text-muted">{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}