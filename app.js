// ============================================================================
// Shahd Mohamed Teleba — Active Portfolio Interactive Engine (app.js)
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => links.classList.remove('open'))
    );
  }

  // 2. Theme Toggle (Dark / Light)
  const themeBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('shahd_theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeBtn) themeBtn.textContent = '🌙';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      if (next === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.textContent = '🌙';
      } else {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.textContent = '☀️';
      }
      localStorage.setItem('shahd_theme', next);
      showToast(`Switched to ${next} mode`);
    });
  }

  // 3. Print / Save CV Button
  const printBtn = document.getElementById('printCvBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 4. Scroll Progress Bar & Scroll-Spy Navigation + Reveal Animations
  const progressBar = document.getElementById('scrollProgress');
  const navAnchors = document.querySelectorAll('.navlinks a[href^="#"]');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  // Scroll-Spy Observer
  const spyObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  );
  sections.forEach(sec => spyObserver.observe(sec));

  // Section Reveal Observer
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 5. Dynamic Role Typewriter in Hero
  const roleTarget = document.getElementById('dynamicRole');
  const phrases = [
    'predictive models',
    'front-end applications',
    'NLP & FastAPI tools',
    'clean data pipelines'
  ];
  let phraseIdx = 0;
  let charIdx = phrases[0].length;
  let isDeleting = false;

  function tickRole() {
    if (!roleTarget) return;
    const currentPhrase = phrases[phraseIdx];
    if (isDeleting) {
      charIdx--;
      roleTarget.textContent = currentPhrase.substring(0, charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tickRole, 320);
      } else {
        setTimeout(tickRole, 38);
      }
    } else {
      charIdx++;
      roleTarget.textContent = currentPhrase.substring(0, charIdx);
      if (charIdx === currentPhrase.length) {
        isDeleting = true;
        setTimeout(tickRole, 2200);
      } else {
        setTimeout(tickRole, 65);
      }
    }
  }
  setTimeout(() => {
    isDeleting = true;
    tickRole();
  }, 2400);

  // 6. One-Click Copy Buttons & Toast Notification
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
      }).catch(() => {
        window.location.href = btn.getAttribute('href') || '#contact';
      });
    });
  });

  // 7. Interactive Skill Cross-Highlighting
  const skillTags = document.querySelectorAll('.skill-tag');
  const skillBanner = document.getElementById('skillFilterBar');
  const activeSkillName = document.getElementById('activeSkillName');
  const activeSkillCount = document.getElementById('activeSkillCount');
  const clearSkillBtn = document.getElementById('clearSkillFilter');
  const matchableItems = document.querySelectorAll('[data-skills]');
  let selectedSkill = null;

  // Populate badge counts on each skill pill
  skillTags.forEach(tag => {
    const key = tag.getAttribute('data-skill-key');
    let count = 0;
    matchableItems.forEach(item => {
      const itemSkills = (item.getAttribute('data-skills') || '').toLowerCase();
      if (itemSkills.includes(key.toLowerCase())) count++;
    });
    const badge = tag.querySelector('.s-count');
    if (badge && count > 0) badge.textContent = count;
  });

  function applySkillFilter(skillKey, labelText) {
    if (selectedSkill === skillKey) {
      resetSkillFilter();
      return;
    }
    selectedSkill = skillKey;
    skillTags.forEach(t => {
      t.classList.toggle('active', t.getAttribute('data-skill-key') === skillKey);
    });
    let matchCount = 0;
    let firstMatch = null;
    matchableItems.forEach(item => {
      const itemSkills = (item.getAttribute('data-skills') || '').toLowerCase();
      const matched = itemSkills.includes(skillKey.toLowerCase());
      item.classList.toggle('skill-match', matched);
      if (matched) {
        matchCount++;
        if (!firstMatch) firstMatch = item;
      }
    });
    if (skillBanner && activeSkillName && activeSkillCount) {
      activeSkillName.textContent = labelText;
      activeSkillCount.textContent = `${matchCount} portfolio item${matchCount === 1 ? '' : 's'}`;
      skillBanner.classList.add('visible');
    }
    showToast(`Highlighting "${labelText}" across ${matchCount} items`);
  }

  function resetSkillFilter() {
    selectedSkill = null;
    skillTags.forEach(t => t.classList.remove('active'));
    matchableItems.forEach(item => item.classList.remove('skill-match'));
    if (skillBanner) skillBanner.classList.remove('visible');
  }

  skillTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const key = tag.getAttribute('data-skill-key');
      const label = tag.getAttribute('data-skill-label') || tag.textContent.trim();
      applySkillFilter(key, label);
    });
  });

  if (clearSkillBtn) {
    clearSkillBtn.addEventListener('click', resetSkillFilter);
  }

  // 8. Project Category Tabs Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.proj[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const c = card.getAttribute('data-category');
        if (cat === 'all' || c === cat) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 9. Interactive Project Modals (<dialog>) & Live Mini-Simulators
  const modal = document.getElementById('projectDialog');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');

  const projectData = {
    zoo: {
      tag: 'Machine Learning · UCI Zoo Dataset',
      title: 'Animal Classification & Behavior Analysis',
      summary:
        'Supervised & unsupervised machine learning pipeline trained on the UCI Zoo dataset. Includes feature engineering across 16 biological attributes, PCA cluster visualization, and Decision Tree / Random Forest classification.',
      highlights: [
        'Preprocessed 101 animal instances across 7 taxonomic classes with zero data leakage.',
        'Compared Decision Tree, Random Forest, and K-Means clustering for behavior grouping.',
        'Visualized feature importance showing milk production, feathers, and backbone as primary split nodes.'
      ],
      renderSimulator: () => `
        <div class="sim-box">
          <div class="sim-title">
            <span>⚡ Live UCI Zoo Classifier Simulator</span>
            <span>scikit-learn Decision Tree</span>
          </div>
          <p style="font-size:13px;color:var(--muted);margin:0 0 12px;">
            Toggle biological traits below to run real-time taxonomic inference:
          </p>
          <div class="trait-grid" id="zooTraits">
            <label class="trait-chip"><input type="checkbox" data-trait="milk" checked> Milk</label>
            <label class="trait-chip"><input type="checkbox" data-trait="hair" checked> Hair / Fur</label>
            <label class="trait-chip"><input type="checkbox" data-trait="feathers"> Feathers</label>
            <label class="trait-chip"><input type="checkbox" data-trait="airborne"> Airborne</label>
            <label class="trait-chip"><input type="checkbox" data-trait="aquatic"> Aquatic</label>
            <label class="trait-chip"><input type="checkbox" data-trait="backbone" checked> Backbone</label>
            <label class="trait-chip"><input type="checkbox" data-trait="fins"> Fins</label>
            <label class="trait-chip"><input type="checkbox" data-trait="breathes" checked> Breathes Air</label>
          </div>
          <div class="sim-output" id="zooOutput"></div>
        </div>
      `,
      bindEvents: () => {
        const checkboxes = modalContent.querySelectorAll('#zooTraits input');
        const out = modalContent.querySelector('#zooOutput');
        function runZooInference() {
          const t = {};
          checkboxes.forEach(cb => (t[cb.getAttribute('data-trait')] = cb.checked));
          let cls = 'Mammal';
          let conf = 98.4;
          let rule = 'milk == 1 && backbone == 1';
          if (t.milk) {
            cls = t.aquatic ? 'Mammal (Marine Cetacean / Pinniped)' : 'Mammal (Terrestrial)';
            conf = 99.1;
            rule = 'milk == True → Class 1 (Mammal)';
          } else if (t.feathers) {
            cls = 'Bird (Aves)';
            conf = 98.8;
            rule = 'feathers == True → Class 2 (Bird)';
          } else if (t.aquatic && t.fins && !t.breathes) {
            cls = 'Fish (Pisces)';
            conf = 96.5;
            rule = 'fins == True && breathes == False → Class 4 (Fish)';
          } else if (t.backbone && t.aquatic && t.breathes) {
            cls = 'Amphibian / Semi-Aquatic Reptile';
            conf = 91.2;
            rule = 'backbone == True && aquatic == True && breathes == True → Class 5';
          } else if (t.backbone) {
            cls = 'Reptile (Sauropsida)';
            conf = 89.5;
            rule = 'backbone == True && milk == False && feathers == False → Class 3';
          } else {
            cls = t.airborne ? 'Insect (Hexapoda)' : 'Invertebrate (Arthropod / Mollusk)';
            conf = 94.0;
            rule = 'backbone == False → Class 6/7 (Invertebrate)';
          }
          out.innerHTML = `
            <div><strong>Predicted Class:</strong> <span style="color:var(--teal)">${cls}</span></div>
            <div style="margin-top:4px;"><strong>Model Confidence:</strong> <span style="color:var(--amber)">${conf}%</span></div>
            <div style="margin-top:4px;font-size:12px;color:var(--muted);">Active Split Rule: <code>${rule}</code></div>
          `;
        }
        checkboxes.forEach(cb => cb.addEventListener('change', runZooInference));
        runZooInference();
      }
    },
    travel: {
      tag: 'Software Engineering · Java · OOP · SOLID',
      title: 'Smart Travel Booking System',
      summary:
        'An object-oriented travel reservation engine architected in Java using strict SOLID principles. Implements Strategy pattern for dynamic surge/seasonal pricing, Decorator for add-on services, and Factory pattern for multi-modal itineraries.',
      highlights: [
        'Single Responsibility & Open/Closed compliance: new pricing rules plug in without modifying core BookingService.',
        'Dynamic fare calculation factoring seat class, seasonal demand multipliers, and early-bird discounts.',
        'Clean domain separation between Itinerary, PricingStrategy, PaymentGateway, and LoyaltyTier.'
      ],
      renderSimulator: () => `
        <div class="sim-box">
          <div class="sim-title">
            <span>✈️ SOLID Pricing Strategy Simulator</span>
            <span>IPricingStrategy.calculateFare()</span>
          </div>
          <div class="sim-controls-row">
            <div class="sim-field">
              <label>Route</label>
              <select id="trRoute">
                <option value="220">Cairo (CAI) → Assiut (ATZ) [$220 base]</option>
                <option value="480">Cairo (CAI) → Dubai (DXB) [$480 base]</option>
                <option value="750">Cairo (CAI) → London (LHR) [$750 base]</option>
              </select>
            </div>
            <div class="sim-field">
              <label>Pricing Strategy (OCP)</label>
              <select id="trStrategy">
                <option value="1.0">StandardPricingStrategy (1.0x)</option>
                <option value="1.35">PeakSeasonStrategy (1.35x)</option>
                <option value="0.82">EarlyBirdDiscountStrategy (0.82x)</option>
              </select>
            </div>
            <div class="sim-field">
              <label>Cabin Class</label>
              <select id="trClass">
                <option value="1.0">Economy (1.0x)</option>
                <option value="1.6">Business Class (1.6x)</option>
                <option value="2.4">First Class Suite (2.4x)</option>
              </select>
            </div>
          </div>
          <div class="sim-output" id="trOutput"></div>
        </div>
      `,
      bindEvents: () => {
        const routeEl = modalContent.querySelector('#trRoute');
        const stratEl = modalContent.querySelector('#trStrategy');
        const classEl = modalContent.querySelector('#trClass');
        const out = modalContent.querySelector('#trOutput');
        function calcFare() {
          const base = parseFloat(routeEl.value);
          const mult = parseFloat(stratEl.value);
          const cab = parseFloat(classEl.value);
          const total = (base * mult * cab).toFixed(2);
          const stratName = stratEl.options[stratEl.selectedIndex].text.split(' ')[0];
          out.innerHTML = `
            <div><strong>Computed Fare:</strong> <span style="color:var(--teal)">$${total} USD</span></div>
            <div style="margin-top:4px;font-size:12px;color:var(--muted);">
              Injected Bean: <code>new ${stratName}()</code> · Base $${base} × ${mult} × ${cab}
            </div>
          `;
        }
        [routeEl, stratEl, classEl].forEach(el => el.addEventListener('change', calcFare));
        calcFare();
      }
    },
    resume: {
      tag: 'AI / Full-Stack · Python · NLP · FastAPI · React',
      title: 'AI Resume Analyzer',
      summary:
        'An end-to-end NLP application that parses candidate resumes, extracts technical entities, computes cosine similarity against target job descriptions via a FastAPI backend, and renders actionable feedback in a responsive React UI.',
      highlights: [
        'FastAPI REST microservice performing tokenization, stop-word removal, and TF-IDF / embedding keyword matching.',
        'Interactive React dashboard highlighting matched skills, missing keywords, and section completeness.',
        'Designed to help students and engineers optimize resumes for Applicant Tracking Systems (ATS).'
      ],
      renderSimulator: () => `
        <div class="sim-box">
          <div class="sim-title">
            <span>🧠 Live NLP Resume Matcher</span>
            <span>FastAPI + React Preview</span>
          </div>
          <div class="sim-controls-row">
            <div class="sim-field">
              <label>Target Role Profile</label>
              <select id="nlpRole">
                <option value="python,machine learning,scikit-learn,pandas,sql,fastapi,nlp">Machine Learning Engineer</option>
                <option value="javascript,react,vue,html,css,frontend,responsive">Front-End Web Developer</option>
                <option value="python,sql,pandas,excel,data analysis,visualization">Data Analyst</option>
              </select>
            </div>
          </div>
          <div class="sim-field" style="margin-bottom:12px;">
            <label>Candidate Resume Snippet (Editable)</label>
            <textarea id="nlpText" rows="3">AI & ML Developer skilled in Python, scikit-learn, Pandas, SQL, and building FastAPI + React and Vue front-end interfaces with NLP models.</textarea>
          </div>
          <div class="sim-output" id="nlpOutput"></div>
        </div>
      `,
      bindEvents: () => {
        const roleEl = modalContent.querySelector('#nlpRole');
        const textEl = modalContent.querySelector('#nlpText');
        const out = modalContent.querySelector('#nlpOutput');
        function runNlp() {
          const required = roleEl.value.split(',');
          const raw = textEl.value.toLowerCase();
          const matched = required.filter(k => raw.includes(k));
          const missing = required.filter(k => !raw.includes(k));
          const score = Math.round((matched.length / required.length) * 100);
          out.innerHTML = `
            <div><strong>ATS Match Score:</strong> <span style="color:var(--teal);font-size:16px;">${score}%</span> (${matched.length}/${required.length} core entities)</div>
            <div style="margin-top:6px;font-size:12.5px;">
              <strong>Detected Keywords:</strong> <span style="color:var(--amber)">${matched.join(', ') || 'None'}</span>
            </div>
            <div style="margin-top:4px;font-size:12px;color:var(--muted);">
              ${missing.length ? `Recommended additions: <code>${missing.join(', ')}</code>` : '✅ Optimal keyword alignment achieved!'}
            </div>
          `;
        }
        roleEl.addEventListener('change', runNlp);
        textEl.addEventListener('input', runNlp);
        runNlp();
      }
    },
    renew: {
      tag: 'Sustainability · Platform Design & Smart Routing',
      title: 'ReNew Egypt',
      summary:
        'A smart waste management and circular-economy platform concept designed for Egyptian governorates, connecting neighborhood collection points with verified industrial recycling demand.',
      highlights: [
        'Digital marketplace matching sorted plastic, paper, and e-waste supply with recycling facilities.',
        'Data-driven collection scheduling to reduce municipal fuel consumption and overflow.',
        'Community incentive model rewarding households for verified recyclable drop-offs.'
      ],
      renderSimulator: () => `
        <div class="sim-box">
          <div class="sim-title">
            <span>🌱 Circular Economy Impact Estimator</span>
            <span>Assiut & Upper Egypt Hub Model</span>
          </div>
          <div class="sim-controls-row">
            <div class="sim-field">
              <label>Monthly Recyclables Collected: <span id="rnTonsVal" style="color:var(--teal)">15 Tons</span></label>
              <input type="range" id="rnTons" min="5" max="100" step="5" value="15">
            </div>
          </div>
          <div class="sim-output" id="rnOutput"></div>
        </div>
      `,
      bindEvents: () => {
        const slider = modalContent.querySelector('#rnTons');
        const labelVal = modalContent.querySelector('#rnTonsVal');
        const out = modalContent.querySelector('#rnOutput');
        function updateImpact() {
          const tons = parseInt(slider.value, 10);
          labelVal.textContent = `${tons} Tons`;
          const co2 = (tons * 1.85).toFixed(1);
          const households = tons * 42;
          out.innerHTML = `
            <div><strong>CO₂ Emissions Prevented:</strong> <span style="color:var(--teal)">${co2} Metric Tons / month</span></div>
            <div style="margin-top:4px;"><strong>Participating Households Served:</strong> <span style="color:var(--amber)">~${households.toLocaleString()}</span></div>
          `;
        }
        slider.addEventListener('input', updateImpact);
        updateImpact();
      }
    }
  };

  document.querySelectorAll('.proj[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-project');
      const data = projectData[key];
      if (!data || !modal) return;
      modalTag.textContent = data.tag;
      modalTitle.textContent = data.title;
      modalContent.innerHTML = `
        <p style="font-size:15.5px;color:var(--text);margin-top:0;">${data.summary}</p>
        <ul style="padding-left:18px;color:var(--muted);font-size:14px;">
          ${data.highlights.map(h => `<li style="margin-bottom:6px;">${h}</li>`).join('')}
        </ul>
        ${data.renderSimulator()}
        <div style="margin-top:18px;display:flex;justify-content:flex-end;gap:10px;">
          <a href="https://github.com/shahdghaly25" target="_blank" rel="noopener" class="pill-btn primary">
            View on GitHub (@shahdghaly25) ↗
          </a>
        </div>
      `;
      modal.showModal();
      data.bindEvents();
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.close());
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.close();
    });
  }

  // 10. "Ask Shahd's AI" Recruiter Assistant
  const aiFab = document.getElementById('aiFab');
  const aiDrawer = document.getElementById('aiDrawer');
  const aiClose = document.getElementById('aiCloseBtn');
  const aiMessages = document.getElementById('aiMessages');
  const aiInput = document.getElementById('aiInput');
  const aiSend = document.getElementById('aiSendBtn');

  function answerQuestion(q) {
    const s = q.toLowerCase();
    if (s.includes('flyrank') || s.includes('intern') || s.includes('experience')) {
      return "Shahd is currently a **Machine Learning Engineering Intern at FlyRank AI** (2026–Present), building AI-driven organic growth and search-visibility tooling. Previously, she completed an **AI Internship at CodeAlpha** (06/2026–07/2026).";
    }
    if (s.includes('project') || s.includes('resume') || s.includes('zoo') || s.includes('travel')) {
      return "Shahd has built 4 standout projects: **AI Resume Analyzer** (Python, NLP, FastAPI, React), **Animal Classification & Behavior Analysis** (scikit-learn, Pandas), **Smart Travel Booking System** (Java OOP & SOLID), and **ReNew Egypt**. Click any project card on the page to test its live interactive simulator!";
    }
    if (s.includes('frontend') || s.includes('front-end') || s.includes('vue') || s.includes('react') || s.includes('web')) {
      return "Alongside ML, Shahd is trained in **Front-End Web Development with Vue.js (ITI)** as well as **React, HTML5, CSS3, and JavaScript**, allowing her to turn raw ML models into polished user interfaces.";
    }
    if (s.includes('education') || s.includes('university') || s.includes('cert') || s.includes('depi') || s.includes('iti')) {
      return "She is pursuing her **B.Sc. in Artificial Intelligence & Data Management** at **Badr University in Assiut** (2024–Present) and holds certifications from **DEPI (ITI)**, **Egypt Makes Electronics (40 hrs ML)**, **ITI / NTI**, and **Vue.js Front-End (ITI)**.";
    }
    if (s.includes('contact') || s.includes('email') || s.includes('hire') || s.includes('phone')) {
      return "You can reach Shahd directly at **shahdghaly25@gmail.com**, call **0106 767 8257**, or connect via **linkedin.com/in/shahdghaly** and **github.com/shahdghaly25**.";
    }
    if (s.includes('leader') || s.includes('gdg') || s.includes('community')) {
      return "Shahd serves as a **Marketing Member at Google Developer Groups (GDG) & Girl Up Upper Egypt**, leads academic project teams at Badr University, and volunteered as a **Kids Trainer** with the Demi & Deci Program.";
    }
    return "Shahd Mohamed Teleba is an **AI & Machine Learning Developer** based in Assiut, Egypt, specializing in Python, Predictive Modeling, SQL, and modern Front-End interfaces (Vue.js / React). Ask me about her **FlyRank AI internship**, **projects**, **skills**, or **contact info**!";
  }

  function appendAiMsg(text, sender = 'bot') {
    if (!aiMessages) return;
    const div = document.createElement('div');
    div.className = `ai-msg ${sender}`;
    div.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    aiMessages.appendChild(div);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }

  if (aiFab && aiDrawer) {
    aiFab.addEventListener('click', () => {
      aiDrawer.classList.toggle('open');
      if (aiDrawer.classList.contains('open') && aiInput) aiInput.focus();
    });
  }
  if (aiClose && aiDrawer) {
    aiClose.addEventListener('click', () => aiDrawer.classList.remove('open'));
  }

  function handleUserAiSubmit(queryText) {
    const q = (queryText || (aiInput ? aiInput.value : '')).trim();
    if (!q) return;
    if (aiInput) aiInput.value = '';
    appendAiMsg(q, 'user');
    setTimeout(() => {
      appendAiMsg(answerQuestion(q), 'bot');
    }, 240);
  }

  if (aiSend) aiSend.addEventListener('click', () => handleUserAiSubmit());
  if (aiInput) {
    aiInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleUserAiSubmit();
    });
  }

  document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      handleUserAiSubmit(chip.getAttribute('data-prompt'));
    });
  });

  // 11. Quick Contact Form in Footer
  const contactForm = document.getElementById('quickContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const senderName = document.getElementById('cfName').value.trim();
      const senderSubject = document.getElementById('cfSubject').value.trim() || 'Portfolio Inquiry';
      const senderMsg = document.getElementById('cfMessage').value.trim();
      const body = encodeURIComponent(`Hi Shahd,\n\n${senderMsg}\n\nBest regards,\n${senderName}`);
      const mailto = `mailto:shahdghaly25@gmail.com?subject=${encodeURIComponent(senderSubject)}&body=${body}`;
      showToast('Opening email client...');
      window.location.href = mailto;
    });
  }

  // 12. Interactive Mouse-Reactive Neural Network Canvas (#net)
  const canvas = document.getElementById('net');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: -9999, y: -9999, active: false };
    const pulses = [];

    function resize() {
      const hero = document.querySelector('.hero');
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function initNodes() {
      const count = Math.max(24, Math.floor(w / 68));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.8 + Math.random() * 1.2
      }));
    }

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    canvas.addEventListener('click', e => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      pulses.push({ x: cx, y: cy, radius: 4, alpha: 0.75 });
      // Add a new neuron node where clicked (capped at 55)
      if (nodes.length < 55) {
        nodes.push({
          x: cx,
          y: cy,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: 2.5
        });
      }
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Update & draw click pulses
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.radius += 3.2;
        pulse.alpha -= 0.018;
        if (pulse.alpha <= 0) {
          pulses.splice(p, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(95, 227, 196, ${pulse.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const n of nodes) {
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;

          if (mouse.active) {
            const dx = mouse.x - n.x;
            const dy = mouse.y - n.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 180 && dist > 1) {
              n.x += (dx / dist) * 0.35;
              n.y += (dy / dist) * 0.35;
            }
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        // Connect to mouse cursor
        if (mouse.active) {
          const mDist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (mDist < 190) {
            ctx.strokeStyle = `rgba(242, 166, 90, ${0.32 * (1 - mDist / 190)})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 165) {
            ctx.strokeStyle = `rgba(95, 227, 196, ${0.18 * (1 - dist / 165)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = 'rgba(242, 166, 90, 0.7)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      resize();
      initNodes();
    });
    resize();
    initNodes();
    draw();
  }
});
