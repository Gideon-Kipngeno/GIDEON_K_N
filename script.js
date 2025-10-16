document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio loaded ✅");

  // Create scroll progress indicator
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  document.body.appendChild(scrollProgress);

  // Update scroll progress
  window.addEventListener('scroll', () => {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - winHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    scrollProgress.style.width = `${scrolled}%`;
  });

  // Enhanced section observer with parallax effect
  const sections = document.querySelectorAll("section");
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        
        // Add parallax effect to background
        const speed = entry.target.getAttribute('data-speed') || 0.5;
        const yPos = -(window.scrollY * speed);
        entry.target.style.backgroundPosition = `center ${yPos}px`;
        
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach((sec) => {
    sec.setAttribute('data-speed', '0.3');
    sectionObserver.observe(sec);
  });

  // Enhanced button interactions
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mousedown', (e) => {
      e.currentTarget.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', (e) => {
      e.currentTarget.style.transform = '';
    });
    
    button.addEventListener('mouseleave', (e) => {
      e.currentTarget.style.transform = '';
    });
  });

  // Enhanced form validation with better UX
  const contactForm = document.getElementById("contact-form");
  const inputs = contactForm.querySelectorAll('input, textarea');
  
  inputs.forEach(input => {
    // Add floating label effect
    const placeholder = input.getAttribute('placeholder');
    if (placeholder) {
      input.addEventListener('focus', () => {
        input.setAttribute('data-placeholder', placeholder);
        input.setAttribute('placeholder', '');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.setAttribute('placeholder', placeholder);
          input.removeAttribute('data-placeholder');
        }
      });
    }
    
    input.addEventListener('invalid', (e) => {
      e.preventDefault();
      input.style.borderColor = '#e53e3e';
      input.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.2)';
      
      // Shake animation for invalid input
      input.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        input.style.animation = '';
      }, 500);
    });
    
    input.addEventListener('input', () => {
      if (input.validity.valid) {
        input.style.borderColor = 'var(--accent)';
        input.style.boxShadow = '0 0 0 3px rgba(100, 255, 218, 0.2)';
      } else {
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        input.style.boxShadow = 'none';
      }
    });
  });

  // Add shake animation for invalid form inputs
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  // Enhanced project card loading
  async function loadProjects() {
    try {
      const res = await fetch("projects.json");
      const projects = await res.json();
      const container = document.getElementById("projects-container");

      projects.forEach((project, i) => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
          <img src="${project.image}" alt="${project.title}" loading="lazy">
          <div class="project-info">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-links">
              <a href="${project.demo}" target="_blank" class="btn outline">Live Demo</a>
              <a href="${project.github}" target="_blank" class="btn secondary">View Code</a>
            </div>
          </div>
        `;
        container.appendChild(card);
        
        // Staggered animation with better timing
        setTimeout(() => {
          card.classList.add("visible");
        }, i * 200);
      });
    } catch (err) {
      console.error("Failed to load projects.json", err);
    }
  }
  loadProjects();

  // Enhanced form submission with better feedback
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(contactForm);

    try {
      const res = await fetch("https://formspree.io/f/mdkwdgrb", {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      
      if (res.ok) {
        // Success animation
        submitBtn.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        submitBtn.textContent = 'Message Sent!';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Error state
      submitBtn.style.background = 'linear-gradient(135deg, #e53e3e 0%, #c53030 100%)';
      submitBtn.textContent = 'Failed to Send';
      
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 2000);
    }
  });

  // Add smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});