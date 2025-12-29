(function(){
  // CONFIG: Set this to your Formspree endpoint if you have one.
  // Example: 'https://formspree.io/f/your-id'
  const FORM_ENDPOINT = "";
  const RECIPIENT_EMAIL = "thejosephmoyerproject@gmail.com";

  function showThanksModal(){
    if(document.getElementById('jm-form-modal')) return;
    const overlay = document.createElement('div');
    overlay.id = 'jm-form-modal';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.45)', zIndex: 1200
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      background: '#fff', padding: '1.25rem 1.5rem', borderRadius: '10px', maxWidth: '520px', width: '90%', textAlign: 'center', boxShadow: '0 12px 40px rgba(2,6,23,0.18)'
    });

    const msg = document.createElement('p');
    msg.textContent = 'Thank you for your inquiry! I will return your message within 72 hours.';
    msg.style.margin = '0 0 1rem';

    const btn = document.createElement('button');
    btn.textContent = 'Close';
    Object.assign(btn.style, {padding: '0.5rem 0.9rem', borderRadius: '6px', border: 'none', background: '#111827', color: '#fff', cursor: 'pointer'});
    btn.addEventListener('click', () => overlay.remove());

    box.appendChild(msg);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  async function postToEndpoint(form, formData){
    // If using Formspree, POST formData directly to FORM_ENDPOINT
    try{
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
      return res.ok;
    }catch(e){
      return false;
    }
  }

  function toMailto(formData){
    let body = '';
    for(const [k,v] of formData.entries()){
      body += `${k}: ${v}\n`;
    }
    const subject = `Website inquiry from ${location.hostname}`;
    const mailto = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  document.addEventListener('DOMContentLoaded', function(){
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      // skip forms explicitly opting out
      if(form.dataset.noClientHandler === 'true') return;
      // If the form is handled by Netlify (has data-netlify or netlify attribute), don't intercept it here.
      if(form.hasAttribute('data-netlify') || form.hasAttribute('netlify')) return;
      form.addEventListener('submit', async function(e){
        // let native HTML validation run
        if(!form.checkValidity()) return;
        e.preventDefault();
        const fd = new FormData(form);
        // try configured endpoint first
        if(FORM_ENDPOINT){
          const ok = await postToEndpoint(form, fd);
          if(ok){
            showThanksModal();
            form.reset();
          } else {
            alert('Submission failed — please try again or contact ' + RECIPIENT_EMAIL);
          }
        } else {
          // fallback: open user's mail client to send to RECIPIENT_EMAIL
          toMailto(fd);
          // show modal so user sees confirmation after returning
          try{ showThanksModal(); }catch(e){}
          form.reset();
        }
      });
    });
  });
})();
