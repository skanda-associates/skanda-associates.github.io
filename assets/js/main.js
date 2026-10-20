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
  initProjectGalleryModal();
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
        b.classList.remove('active', 'gold-gradient-bg', 'text-white');
        b.classList.add('text-slate-700', 'bg-[#CEE0EF]');
      });

      btn.classList.add('active', 'gold-gradient-bg', 'text-white');
      btn.classList.remove('text-slate-700', 'bg-[#CEE0EF]');

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

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY > 350) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


const PROJECT_GALLERIES = {
  'kolkata-metro': {
    title: 'Kolkata Metro',
    badge: 'Worked as Site Engineer',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    subtitle: 'Hindustan Construction Company (HCC) • Underground Rapid Transit System',
    images: [
      { src: 'assets/images/projects/kolkata-metro/img-1.jpg', caption: 'Kolkata Metro Underground Station & Concourse Infrastructure' },
      { src: 'assets/images/projects/kolkata-metro/img-2.jpg', caption: 'Rapid Transit Train Arriving at Underground Metro Platform' },
      { src: 'assets/images/projects/kolkata-metro/img-3.jpg', caption: 'Subsurface Station Structural Construction & Civil Engineering Works' },
      { src: 'assets/images/projects/kolkata-metro/img-4.jpg', caption: 'Station Platform Civil Works & Passenger Transit Bay' },
      { src: 'assets/images/projects/kolkata-metro/img-5.jpg', caption: 'Historic Underground Rapid Transit Network (First in India)' }
    ]
  },
  'nashik-glass': {
    title: 'Nashik Glass Works',
    badge: 'Worked as Site Engineer',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    subtitle: 'Larsen & Toubro (L&T) • Heavy Industrial Manufacturing Facility (Sinnar, Nashik)',
    images: [
      { src: 'assets/images/projects/nashik-glass/img-1.jpg', caption: 'L&T Heavy Industrial Container Glass Manufacturing Facility (Sinnar MIDC)' },
      { src: 'assets/images/projects/nashik-glass/img-2.jpg', caption: 'Industrial High-Temperature Glass Melting Furnace & Structural Plant' },
      { src: 'assets/images/projects/nashik-glass/img-3.jpg', caption: 'Automated Container Glass Production Line & Forming Infrastructure' },
      { src: 'assets/images/projects/nashik-glass/img-4.jpg', caption: 'Heavy Manufacturing Floor Civil & Structural Foundations' },
      { src: 'assets/images/projects/nashik-glass/img-5.jpg', caption: 'Finished Glass Container Processing & Industrial Warehousing' }
    ]
  },
  'escorts-hospital': {
    title: 'Escorts Hospital, Faridabad',
    badge: 'Worked as Site Engineer',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    subtitle: 'WS Atkins (I) Pvt. Ltd. • Multi-Speciality Healthcare Infrastructure (Neelam Bata Road)',
    images: [
      { src: 'assets/images/projects/escorts-hospital/img-1.jpg', caption: 'Fortis Escorts Hospital Main Architectural Building Exterior (Faridabad)' },
      { src: 'assets/images/projects/escorts-hospital/img-2.jpg', caption: 'Emergency & Critical Care Healthcare Complex Entrance Wing' },
      { src: 'assets/images/projects/escorts-hospital/img-3.jpg', caption: 'Multi-Speciality Hospital Campus Civil Infrastructure & Façade' },
      { src: 'assets/images/projects/escorts-hospital/img-4.jpg', caption: 'Diagnostic Wings, Patient Blocks & Healthcare Facilities' },
      { src: 'assets/images/projects/escorts-hospital/img-5.jpg', caption: 'Institutional Healthcare Infrastructure & Architectural Elevation' }
    ]
  },
  'emco-dubai': {
    title: 'EMCO – Dubai Oil Refineries',
    badge: 'Worked as Site Engineer',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    subtitle: 'Various Oil Refineries • International Petrochemical Installations & Storage (UAE)',
    images: [
      { src: 'assets/images/projects/emco-dubai/img-1.jpg', caption: 'Jebel Ali Refinery Distillation Towers & Fractionation Units (Dubai)' },
      { src: 'assets/images/projects/emco-dubai/img-2.jpg', caption: 'Petrochemical Storage Terminal & Pressure Vessel Installations' },
      { src: 'assets/images/projects/emco-dubai/img-3.jpg', caption: 'Refinery Structural Steel Framing & Industrial Pipe Rack Networks' },
      { src: 'assets/images/projects/emco-dubai/img-4.jpg', caption: 'Petroleum Refinery Infrastructure & Atmospheric Distillation Columns' },
      { src: 'assets/images/projects/emco-dubai/img-5.jpg', caption: 'Heavy Industrial Petrochemical Processing & Maritime Tank Farm' }
    ]
  },
  'aramco-saudi': {
    title: 'Aramco Saudi Admin Building Retrofittings',
    badge: 'Worked as Site Engineer',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    subtitle: 'Admin Building Retrofittings • Structural Rehabilitation & Engineering (Dhahran, KSA)',
    images: [
      { src: 'assets/images/projects/aramco-saudi/img-1.jpg', caption: 'Saudi Aramco Main Administration Complex Exterior (Dhahran, KSA)' },
      { src: 'assets/images/projects/aramco-saudi/img-2.jpg', caption: 'Aramco Al-Midra Administration Building Architectural Facade' },
      { src: 'assets/images/projects/aramco-saudi/img-3.jpg', caption: 'Corporate Headquarters Admin Wing Retrofitting & Civil Infrastructure' },
      { src: 'assets/images/projects/aramco-saudi/img-4.jpg', caption: 'Administrative Campus Facade Rehabilitation & Structural Works' },
      { src: 'assets/images/projects/aramco-saudi/img-5.jpg', caption: 'Executive Headquarters Building & Facility Rehabilitation' }
    ]
  },
  'garuda-mall': {
    title: 'Garuda Mall, Magrath Road',
    badge: 'Project Head as PMC Representative',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtitle: 'Premier CBD Retail & Multiplex Commercial Hub (Magrath Road, Bengaluru)',
    images: [
      { src: 'assets/images/projects/garuda-mall/img-1.jpg', caption: 'Garuda Mall Iconic Exterior Facade on Magrath Road (Bengaluru)' },
      { src: 'assets/images/projects/garuda-mall/img-2.jpg', caption: 'Central Multi-Tier Shopping Atrium & Escalator Circulation' },
      { src: 'assets/images/projects/garuda-mall/img-3.jpg', caption: 'Magrath Road Main Entrance & CBD Commercial Hub Plaza' },
      { src: 'assets/images/projects/garuda-mall/img-4.jpg', caption: 'Premier Retail Gallerias & Indoor Skylight Architecture' },
      { src: 'assets/images/projects/garuda-mall/img-5.jpg', caption: 'Multiplex & Commercial Retail Concourse Levels' }
    ]
  },
  'akme-harmony': {
    title: 'AKME Harmony',
    badge: 'Project Head as PMC Representative',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtitle: 'Premium Gated Residential Community & Lifestyle Enclave (Bellandur, Outer Ring Road)',
    images: [
      { src: 'assets/images/projects/akme-harmony/img-1.jpg', caption: 'AKME Harmony Residential Towers Facade (Bellandur, Outer Ring Road)' },
      { src: 'assets/images/projects/akme-harmony/img-2.jpg', caption: 'Gated Community High-Rise Residential Blocks & Landscaping' },
      { src: 'assets/images/projects/akme-harmony/img-3.jpg', caption: 'Clubhouse Facility & Swimming Pool Enclave' },
      { src: 'assets/images/projects/akme-harmony/img-4.jpg', caption: 'Residential Tower Architecture & Lifestyle Community Grounds' },
      { src: 'assets/images/projects/akme-harmony/img-5.jpg', caption: 'Campus Driveway, Green Zones & Residential Living Quarters' }
    ]
  },
  'divyasree-techpark': {
    title: 'Divyasree Tech Park',
    badge: 'Project Head as PMC Representative',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtitle: 'Grade-A Corporate IT Campus & Commercial Development (DivyaSree Technopolis, Bengaluru)',
    images: [
      { src: 'assets/images/projects/divyasree-techpark/img-1.jpg', caption: 'DivyaSree Technopolis Grade-A Corporate IT Campus (Bengaluru)' },
      { src: 'assets/images/projects/divyasree-techpark/img-2.jpg', caption: 'Modern Glass Curtain Wall Commercial Office Blocks' },
      { src: 'assets/images/projects/divyasree-techpark/img-3.jpg', caption: 'Corporate IT Park Entrance Plaza & Landscape Gardens' },
      { src: 'assets/images/projects/divyasree-techpark/img-4.jpg', caption: 'Signature Tech Park Block & Multinational Corporate Offices' },
      { src: 'assets/images/projects/divyasree-techpark/img-5.jpg', caption: 'Commercial Campus Infrastructure & Central Courtyard' }
    ]
  },
  'express-avenue': {
    title: 'Express Mall (Express Avenue), Chennai',
    badge: 'Project Head as PMC Representative',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtitle: 'Mega Retail, Hospitality & Commercial Destination (Royapettah, Chennai)',
    images: [
      { src: 'assets/images/projects/express-avenue/img-1.jpg', caption: 'Express Avenue Mall Landmark Exterior Facade (Royapettah, Chennai)' },
      { src: 'assets/images/projects/express-avenue/img-2.jpg', caption: 'Grand Central Atrium & Multi-Storey Retail Rotunda' },
      { src: 'assets/images/projects/express-avenue/img-3.jpg', caption: 'Royapettah Boulevard Commercial Entrance & Public Plaza' },
      { src: 'assets/images/projects/express-avenue/img-4.jpg', caption: 'Shopping Arcades, Escalator Hubs & Architectural Skylights' },
      { src: 'assets/images/projects/express-avenue/img-5.jpg', caption: 'Full Architectural Elevation & Commercial Entertainment Complex' }
    ]
  },
  'db-city-indore': {
    title: 'Dainik Bhaskar Mall (DB City Mall), Indore',
    badge: 'Project Head as PMC Representative',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtitle: "Central India's Largest Landmark Regional Shopping Mall (Indore)",
    images: [
      { src: 'assets/images/projects/db-city-indore/img-1.jpg', caption: 'DB City Mall Grand Architectural Facade & Main Entrance (Indore)' },
      { src: 'assets/images/projects/db-city-indore/img-2.jpg', caption: 'Spacious Indoor Central Atrium & Multi-Level Shopping Corridors' },
      { src: 'assets/images/projects/db-city-indore/img-3.jpg', caption: 'Retail Concourses & Commercial Brand Outlets' },
      { src: 'assets/images/projects/db-city-indore/img-4.jpg', caption: 'Indoor Architectural Skylight & Shopping Atrium Galleria' },
      { src: 'assets/images/projects/db-city-indore/img-5.jpg', caption: 'Commercial Mall Elevation & Urban Retail Destination' }
    ]
  },
  'mantri-projects': {
    title: 'Mantri Projects',
    badge: 'Project Head as PMC Representative',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtitle: 'Luxury High-Rise Residential & Township Projects (Mantri Square, Mantri Espana, Mantri Greens)',
    images: [
      { src: 'assets/images/projects/mantri-projects/img-1.jpg', caption: 'Mantri Square Mall Landmark Commercial Facade (Malleshwaram)' },
      { src: 'assets/images/projects/mantri-projects/img-2.jpg', caption: 'Mantri Espana Spanish Mediterranean Luxury Architecture (Outer Ring Road, Bellandur)' },
      { src: 'assets/images/projects/mantri-projects/img-3.jpg', caption: 'Mantri Greens High-Rise Residential Towers (Malleshwaram)' },
      { src: 'assets/images/projects/mantri-projects/img-4.jpg', caption: 'Mantri Tranquil Sprawling Hillside Residential Township (Kanakapura Road)' },
      { src: 'assets/images/projects/mantri-projects/img-5.jpg', caption: 'Mantri Altius Ultra-Luxury High-Rise Sky Residences (Bengaluru)' }
    ]
  },
  'golden-gate-50floors': {
    title: '50 Floors – GoldenGate Properties, Yeshwanthpur',
    badge: 'Project Head as PMC Representative',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    subtitle: 'Iconic 50-Story Skyscraper PMC Project Leadership (The Presidential Tower, Bengaluru)',
    images: [
      { src: 'assets/images/projects/golden-gate-50floors/img-1.jpg', caption: 'The Presidential Tower 50-Storey Skyscraper Facade (Yeshwanthpur)' },
      { src: 'assets/images/projects/golden-gate-50floors/img-2.jpg', caption: 'High-Rise Twin Towers Elevation & Structural Skyline Perspective' },
      { src: 'assets/images/projects/golden-gate-50floors/img-3.jpg', caption: '50-Floor Super-Structure Construction & Civil Engineering Marvel' },
      { src: 'assets/images/projects/golden-gate-50floors/img-4.jpg', caption: 'Ultra-Luxury Sky Residence Tower Architectural Elevation' },
      { src: 'assets/images/projects/golden-gate-50floors/img-5.jpg', caption: 'Landmark 50-Story Skyscraper PMC Project Leadership (Bengaluru)' }
    ]
  }
};

/**
 * Project Gallery Lightbox Modal
 * Dynamic image gallery, automated slideshow, manual controls, keyboard & swipe gestures
 */
function initProjectGalleryModal() {
  const modal = document.getElementById('project-gallery-modal');
  if (!modal) return;

  const titleEl = document.getElementById('modal-project-title');
  const badgeEl = document.getElementById('modal-project-badge');
  const subEl = document.getElementById('modal-project-sub');
  const counterEl = document.getElementById('modal-project-counter');
  const mainImgEl = document.getElementById('modal-main-img');
  const captionEl = document.getElementById('modal-img-caption');
  const progressBar = document.getElementById('modal-progress-bar');
  const thumbsContainer = document.getElementById('modal-thumbnails');
  const prevBtn = document.getElementById('modal-prev-btn');
  const nextBtn = document.getElementById('modal-next-btn');
  const closeBtn = document.getElementById('modal-close-btn');
  const autoplayToggleBtn = document.getElementById('modal-autoplay-toggle');
  const autoplayIcon = document.getElementById('modal-autoplay-icon');
  const autoplayLabel = document.getElementById('modal-autoplay-label');
  const slideContainer = document.getElementById('modal-slide-container');

  let currentProject = null;
  let currentIndex = 0;
  let isAutoplayActive = true;
  let progressTimer = null;
  const slideDuration = 3600; // 3.6 seconds per slide
  let progressElapsed = 0;
  const progressStep = 50;

  function updateSlide(index, animate = true) {
    if (!currentProject || !currentProject.images.length) return;
    currentIndex = (index + currentProject.images.length) % currentProject.images.length;
    const item = currentProject.images[currentIndex];

    // Counter
    if (counterEl) {
      counterEl.textContent = `Photo ${currentIndex + 1} of ${currentProject.images.length}`;
    }

    // Main image transition
    if (mainImgEl) {
      if (animate) {
        mainImgEl.style.opacity = '0.3';
        mainImgEl.style.transform = 'scale(0.99)';
        setTimeout(() => {
          mainImgEl.src = item.src;
          mainImgEl.alt = item.caption || currentProject.title;
          mainImgEl.style.opacity = '1';
          mainImgEl.style.transform = 'scale(1)';
        }, 120);
      } else {
        mainImgEl.src = item.src;
        mainImgEl.alt = item.caption || currentProject.title;
        mainImgEl.style.opacity = '1';
        mainImgEl.style.transform = 'scale(1)';
      }
    }

    // Caption
    if (captionEl) {
      captionEl.textContent = item.caption || currentProject.title;
    }

    // Active thumbnail styling
    if (thumbsContainer) {
      const thumbs = thumbsContainer.querySelectorAll('.gallery-thumb-item');
      thumbs.forEach((th, i) => {
        if (i === currentIndex) {
          th.classList.add('active');
          th.style.opacity = '1';
          if (thumbsContainer) {
            const scrollLeftTarget = th.offsetLeft - (thumbsContainer.clientWidth / 2) + (th.clientWidth / 2);
            thumbsContainer.scrollTo({ left: scrollLeftTarget, behavior: 'smooth' });
          }
        } else {
          th.classList.remove('active');
          th.style.opacity = '0.5';
        }
      });
    }

    resetProgress();
  }

  function resetProgress() {
    progressElapsed = 0;
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }

  function startAutoplay() {
    stopAutoplay();
    if (!isAutoplayActive) return;

    progressTimer = setInterval(() => {
      progressElapsed += progressStep;
      const pct = Math.min(100, (progressElapsed / slideDuration) * 100);
      if (progressBar) {
        progressBar.style.width = `${pct}%`;
      }
      if (progressElapsed >= slideDuration) {
        progressElapsed = 0;
        updateSlide(currentIndex + 1, true);
      }
    }, progressStep);
  }

  function stopAutoplay() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
  }

  function toggleAutoplay() {
    isAutoplayActive = !isAutoplayActive;
    if (autoplayLabel) {
      autoplayLabel.textContent = isAutoplayActive ? 'Auto: On' : 'Auto: Paused';
    }
    if (autoplayIcon) {
      autoplayIcon.setAttribute('data-lucide', isAutoplayActive ? 'pause' : 'play');
      if (window.lucide) window.lucide.createIcons();
    }
    if (isAutoplayActive) {
      startAutoplay();
    } else {
      stopAutoplay();
      if (progressBar) progressBar.style.width = '0%';
    }
  }

  function openModal(slug) {
    const data = PROJECT_GALLERIES[slug];
    if (!data) return;

    currentProject = data;
    currentIndex = 0;
    isAutoplayActive = true;

    // Header info
    if (titleEl) titleEl.textContent = data.title;
    if (subEl) subEl.textContent = data.subtitle;
    if (badgeEl) {
      badgeEl.textContent = data.badge;
      badgeEl.className = `px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${data.badgeClass || 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`;
    }

    // Thumbnails
    if (thumbsContainer) {
      thumbsContainer.innerHTML = '';
      data.images.forEach((img, i) => {
        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = `gallery-thumb-item relative w-12 h-9 sm:w-16 sm:h-11 rounded-lg overflow-hidden border-2 border-transparent transition-all cursor-pointer flex-shrink-0 ${i === 0 ? 'active' : 'opacity-50'}`;
        thumbBtn.setAttribute('title', `View photo ${i + 1}`);
        thumbBtn.innerHTML = `<img src="${img.src}" alt="${img.caption}" class="w-full h-full object-cover">`;
        thumbBtn.addEventListener('click', () => {
          updateSlide(i, true);
        });
        thumbsContainer.appendChild(thumbBtn);
      });
    }

    // Reset controls
    if (autoplayLabel) autoplayLabel.textContent = 'Auto: On';
    if (autoplayIcon) {
      autoplayIcon.setAttribute('data-lucide', 'pause');
      if (window.lucide) window.lucide.createIcons();
    }

    const dialogContent = modal.querySelector('.modal-dialog-content');
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }

    updateSlide(0, false);

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Start slideshow
    startAutoplay();

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function closeModal() {
    stopAutoplay();
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Event handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlide(currentIndex - 1, true);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlide(currentIndex + 1, true);
    });
  }
  if (autoplayToggleBtn) {
    autoplayToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleAutoplay();
    });
  }


  // Click outside dialog to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('hidden')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowLeft') {
      updateSlide(currentIndex - 1, true);
    } else if (e.key === 'ArrowRight') {
      updateSlide(currentIndex + 1, true);
    } else if (e.key === ' ') {
      e.preventDefault();
      toggleAutoplay();
    }
  });

  // Mobile Touch Swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  if (slideContainer) {
    slideContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slideContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diffX = touchEndX - touchStartX;
      if (Math.abs(diffX) > 45) {
        if (diffX > 0) {
          updateSlide(currentIndex - 1, true);
        } else {
          updateSlide(currentIndex + 1, true);
        }
      }
    }, { passive: true });
  }

  // Bind globals
  window.openProjectGallery = openModal;
  window.closeProjectGallery = closeModal;

  document.querySelectorAll('[data-project-gallery]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const slug = btn.getAttribute('data-project-gallery');
      openModal(slug);
    });
  });
}
