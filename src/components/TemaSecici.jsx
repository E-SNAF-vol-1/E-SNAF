import React, { useEffect, useState } from 'react';

const TemaSecici = () => {
  const [tema, setTema] = useState(localStorage.getItem('secili-tema') || 'light');

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('dark');
    html.removeAttribute('data-theme');

    if (tema === 'dark') {
      html.classList.add('dark');
    } else if (tema !== 'light') {
      html.setAttribute('data-theme', tema);
    }
    localStorage.setItem('secili-tema', tema);
  }, [tema]);

return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-5 bg-white/10 backdrop-blur-2xl p-3 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.15)] border border-white/40 z-[999999]">
      
      {/* Bej Buton */}
      <button 
        onClick={() => setTema('light')}
        className={`w-11 h-11 rounded-[1.25rem] bg-[#f8f5ea] border-2 transition-all hover:scale-110 active:scale-95 ${tema === 'light' ? 'border-amber-600 shadow-xl shadow-amber-200/50 scale-110' : 'border-transparent opacity-50'}`}
        title="Klasik Bej"
      />

      {/* Dark Buton */}
      <button 
        onClick={() => setTema('dark')}
        className={`w-11 h-11 rounded-[1.25rem] bg-[#1d1d1d] border-2 transition-all hover:scale-110 active:scale-95 ${tema === 'dark' ? 'border-amber-400 shadow-xl shadow-black/50 scale-110' : 'border-transparent opacity-50'}`}
        title="Gece Modu"
      />

      {/* Ocean Buton */}
      <button 
        onClick={() => setTema('ocean')}
        className={`w-11 h-11 rounded-[1.25rem] bg-blue-100 border-2 transition-all hover:scale-110 active:scale-95 ${tema === 'ocean' ? 'border-blue-600 shadow-xl shadow-blue-200/50 scale-110' : 'border-transparent opacity-50'}`}
        title="Okyanus"
      />
    </div>
  );
};

export default TemaSecici;