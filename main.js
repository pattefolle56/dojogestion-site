// ============================================================
// DojoGestion — script partagé
// ============================================================

// Menu mobile
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => links.classList.remove('open'))
  );
})();

// Révélation légère au scroll (respecte prefers-reduced-motion via CSS)
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  items.forEach((el) => el.classList.add('pending'));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
})();

// ------------------------------------------------------------
// Formulaire de contact -> Supabase (table demandes_contact)
//
// Remplacez SUPABASE_URL et SUPABASE_ANON_KEY par les valeurs de
// votre projet (Paramètres > API dans le tableau de bord Supabase).
// La clé "anon" est publique par conception : c'est la RLS de la
// table qui protège les données, pas le secret de cette clé.
// ------------------------------------------------------------
const SUPABASE_URL = 'https://fwyvklvosmwyyqqrtkqo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_iEcJkoDKaoicfP18TVY0Vw_WlU9i1rv';

(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    const payload = {
      nom: form.nom.value.trim(),
      nom_club: form.nom_club.value.trim() || null,
      email: form.email.value.trim(),
      telephone: form.telephone.value.trim() || null,
      message: form.message.value.trim() || null,
    };

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/demandes_contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erreur ' + res.status);

      status.textContent =
        '✅ Demande envoyée — nous revenons vers vous rapidement.';
      status.className = 'form-status show ok';
      form.reset();
    } catch (err) {
      status.textContent =
        '❌ Une erreur est survenue. Vous pouvez aussi nous écrire directement par email.';
      status.className = 'form-status show err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer la demande';
    }
  });
})();