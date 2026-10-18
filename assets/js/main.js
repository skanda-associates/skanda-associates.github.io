/**
 * Skanda Associates - Corporate Portfolio JavaScript
 * Interactive controls, mobile drawer, valuation inquiry generator, animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initMobileNav();
  initServiceTabs();
  initInquiryForm();
  initStatsCounter();
  initScrollNavSpy();
  initBackToTop();
});

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const backdrop = document.getElementById('mobile-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.remove('closed');
    drawer.classList.add('open');
    if (backdrop) {
      backdrop.classList.remove('hidden');
      setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('open');
    drawer.classList.add('closed');
    if (backdrop) {
      backdrop.classList.add('opacity-0');
      setTimeout(() => backdrop.classList.add('hidden'), 300);
    }
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Services Filtering Tabs
 */
function initServiceTabs() {
  const tabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card-item');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.getAttribute('data-category');

      tabBtns.forEach(b => {
        b.classList.remove('active', 'bg-gold-500', 'text-navy-950');
        b.classList.add('text-slate-300', 'bg-navy-800/80');
      });

      btn.classList.add('active', 'bg-gold-500', 'text-navy-950');
      btn.classList.remove('text-slate-300', 'bg-navy-800/80');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (targetCategory === 'all' || cardCategory === targetCategory) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

/**
 * Valuation Inquiry & Request Generator
 */
function initInquiryForm() {
  const form = document.getElementById('valuation-inquiry-form');
  const whatsappBtn = document.getElementById('send-whatsapp-btn');
  const emailBtn = document.getElementById('send-email-btn');

  if (!form) return;

  function collectFormData() {
    const name = document.getElementById('client-name')?.value.trim() || 'Prospective Client';
    const phone = document.getElementById('client-phone')?.value.trim() || 'Not specified';
    const email = document.getElementById('client-email')?.value.trim() || 'Not specified';
    const service = document.getElementById('service-type')?.value || 'Asset Valuation';
    const propertyType = document.getElementById('property-type')?.value || 'Residential / Commercial';
    const location = document.getElementById('property-location')?.value.trim() || 'Bengaluru';
    const notes = document.getElementById('inquiry-notes')?.value.trim() || 'None provided';

    return { name, phone, email, service, propertyType, location, notes };
  }

  function validateBasic(data) {
    if (data.name === 'Prospective Client' || !data.phone || data.phone === 'Not specified') {
      alert('Please provide at least your Name and Phone Number so our team can reach you.');
      return false;
    }
    return true;
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = collectFormData();
      if (!validateBasic(data)) return;

      const message = `*SKANDA ASSOCIATES - NEW SERVICE INQUIRY*\n` +
        `-----------------------------------------\n` +
        `👤 *Client Name:* ${data.name}\n` +
        `📞 *Phone:* ${data.phone}\n` +
        `📧 *Email:* ${data.email}\n` +
        `📋 *Service Requested:* ${data.service}\n` +
        `🏢 *Property Type:* ${data.propertyType}\n` +
        `📍 *Location:* ${data.location}\n` +
        `📝 *Additional Details:* ${data.notes}\n` +
        `-----------------------------------------\n` +
        `_Sent via Skanda Associates Official Portal_`;

      const encodedMsg = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/918792879390?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const data = collectFormData();
      if (!validateBasic(data)) return;

      const subject = `Service Inquiry: ${data.service} - ${data.name}`;
      const body = `Dear Skanda Associates,\n\n` +
        `I would like to request professional consultation for the following requirements:\n\n` +
        `• Name: ${data.name}\n` +
        `• Contact Number: ${data.phone}\n` +
        `• Email Address: ${data.email}\n` +
        `• Service Category: ${data.service}\n` +
        `• Property/Asset Type: ${data.propertyType}\n` +
        `• Property Location: ${data.location}\n` +
        `• Project Scope & Details:\n${data.notes}\n\n` +
        `Kindly revert with the valuation timeline, required documentation, and proposal.\n\n` +
        `Warm regards,\n` +
        `${data.name}`;

      const mailtoUrl = `mailto:phn.rek@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    });
  }
}

/**
 * Animated Stats Counter
 */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = Math.max(1, Math.floor(target / 40));

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.innerText = count + suffix;
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target + suffix;
            }
          };

          updateCount();
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/**
 * Active Navigation Link Spy
 */
function initScrollNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');

  if (!sections.length || !desktopLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = section.getAttribute('id');
      }
    });

    desktopLinks.forEach(link => {
      link.classList.remove('text-gold-400', 'font-semibold');
      link.classList.add('text-slate-300');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-gold-400', 'font-semibold');
        link.classList.remove('text-slate-300');
      }
    });
  }, { passive: true });
}

/**
 * Back to Top Floating Button
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 450) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
