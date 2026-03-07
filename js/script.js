document.addEventListener('DOMContentLoaded', () => {

    // --- HTML Escape Helper (prevents XSS) ---
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // --- 0. Preloader ---
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Instant load
        preloader.style.display = 'none';

        /* 
        // ----------------------------------------------------
        // IF YOU WANT TO ADD A HARDCODED DELAY LATER (e.g. 800ms)
        // UNCOMMENT THIS BLOCK AND COMMENT THE 'display: none' ABOVE:
        // ----------------------------------------------------
        // preloader.style.display = 'flex';
        // setTimeout(() => {
        //     preloader.style.opacity = '0';
        //     preloader.style.visibility = 'hidden';
        //     setTimeout(() => preloader.style.display = 'none', 500); 
        // }, 800);
        */
    }

    // --- 0.5 Theme Toggle System ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    if (themeBtn && themeIcon) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');

            if (document.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }

    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    function toggleMenu() {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }

    hamburger.addEventListener('click', toggleMenu);
    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        });
    });

    // 2. Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Reveal Elements on Scroll
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Unobserve after revealing
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Expose a global function to re-initialize reveals for dynamically added content
    window.refreshReveals = () => {
        const newReveals = document.querySelectorAll('.reveal:not(.active), .reveal-stagger:not(.active)');
        newReveals.forEach(el => {
            revealObserver.observe(el);
        });
    };

    // 4. Modals Logic
    const modalTriggers = document.querySelectorAll('.about-card, .team-card, .board-card, .project-card, #open-join-modal');
    const modals = document.querySelectorAll('.modal-overlay');
    const closeBtns = document.querySelectorAll('.modal-close');

    // Open Modal (standard card triggers)
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Mobile member list rows — tap to open profile modal
    document.querySelectorAll('.mobile-member-row').forEach(row => {
        row.addEventListener('click', () => {
            const modalId = row.getAttribute('data-modal');
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close Modal
    const closeModal = () => {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = ''; // Restore scrolling
    };

    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 5. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // --- 11. Custom Toast Notifications ---
    function showToast(title, message, isError = false) {
        const container = document.getElementById('toast-container');
        if (!container) {
            console.error('Toast container not found. Please add <div id="toast-container"></div> to your HTML.');
            return;
        }
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;

        const icon = document.createElement('i');
        icon.className = `fa-solid ${isError ? 'fa-circle-xmark' : 'fa-circle-check'}`;

        const content = document.createElement('div');
        content.className = 'toast-content';

        const h4 = document.createElement('h4');
        h4.textContent = title;

        const p = document.createElement('p');
        p.textContent = message;

        content.appendChild(h4);
        content.appendChild(p);
        toast.appendChild(icon);
        toast.appendChild(content);

        container.appendChild(toast);

        // Trigger reflow for animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // Wait for transition
        }, 4000);
    }

    // --- 18. Multi-Step Form Wizard Logic ---
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');

    let currentStep = 0;

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Validate current step inputs before moving
            const currentInputs = formSteps[currentStep].querySelectorAll('input[required], select[required], textarea[required]');
            let allValid = true;
            currentInputs.forEach(input => {
                if (!input.checkValidity()) {
                    allValid = false;
                    input.reportValidity();
                }
            });

            if (allValid) {
                currentStep++;
                updateWizard();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateWizard();
        });
    });

    function updateWizard() {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });

        progressLines.forEach((line, index) => {
            if (index < currentStep) {
                line.style.setProperty('--line-width', '100%');
                // We use a small hack by changing the ::after width via a class or inline style
                // but since it's pseudo element, easier to manipulate class
                line.classList.add('filled');
            } else {
                line.classList.remove('filled');
            }
        });
    }

    // We need to update CSS for the line filled state
    const style = document.createElement('style');
    style.innerHTML = `.progress-line.filled::after { width: 100%; }`;
    document.head.appendChild(style);

    // Reset wizard when modal is closed
    const joinModal = document.getElementById('join-modal');
    if (joinModal) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === "class") {
                    if (!joinModal.classList.contains('active')) {
                        // Reset when closed
                        currentStep = 0;
                        updateWizard();
                        document.getElementById('join-form').reset();
                    }
                }
            });
        });
        observer.observe(joinModal, { attributes: true });
    }

    // --- 12. Form Submission Handling with Toasts ---
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        joinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = joinForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://formspree.io/f/meelwjol', {
                    method: 'POST',
                    body: new FormData(joinForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    showToast('Application Sent!', 'Welcome to the club. We will be in touch soon.');
                    joinForm.reset();
                    // Close modal
                    document.getElementById('join-modal').classList.remove('active');
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                showToast('Submission Failed', 'Please try again later or contact us directly.', true);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- 7. Event Countdown Timer ---
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');

    if (daysEl && hoursEl && minutesEl) {
        const countdown = () => {
            const targetDate = new Date('April 5, 2026 00:00:00').getTime();
            const now = new Date().getTime();
            const gap = targetDate - now;

            const second = 1000;
            const minute = second * 60;
            const hour = minute * 60;
            const day = hour * 24;

            const d = Math.floor(gap / day);
            const h = Math.floor((gap % day) / hour);
            const m = Math.floor((gap % hour) / minute);

            daysEl.innerText = d < 10 ? '0' + d : d;
            hoursEl.innerText = h < 10 ? '0' + h : h;
            minutesEl.innerText = m < 10 ? '0' + m : m;
        };
        setInterval(countdown, 60000);
        countdown();
    }

    // --- 8. Parallax Background Orbs (desktop only) ---
    if (!isMobile) {
        const orbs = document.querySelectorAll('.glow-orb');
        document.addEventListener('mousemove', (e) => {
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 3;
                const xOffset = (window.innerWidth / 2 - e.pageX) / speed;
                const yOffset = (window.innerHeight / 2 - e.pageY) / speed;
                orb.style.marginLeft = `${xOffset}px`;
                orb.style.marginTop = `${yOffset}px`;
            });
        });
    }

    // --- 10. Magnetic Buttons (desktop only) ---
    if (!isMobile) {
        const magneticBtns = document.querySelectorAll('.btn-magnetic');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const position = btn.getBoundingClientRect();
                const x = e.pageX - position.left - position.width / 2;
                const y = e.pageY - position.top - position.height / 2;
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
    // --- 13. Animated Stats Counter ---
    const statsSection = document.getElementById('impact');
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.ceil(current) + '+';
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target + '+';
                }
            };
            updateCounter();
        });
    };

    if (statsSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                animateCounters();
                hasCounted = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // --- 16. Filterable Project Portfolio ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                // If filter is 'all', show everything
                if (filterValue === 'all') {
                    card.classList.remove('hide');
                } else {
                    // Check if card category matches filter
                    if (card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                }
            });
        });
    });

    // --- 15. Ripple Effect on Buttons ---
    const rippleBtns = document.querySelectorAll('.btn-primary, .btn-secondary');
    rippleBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripples = document.createElement('span');
            ripples.className = 'ripple';
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove()
            }, 1000);
        })
    });

    // --- 17. Interactive Terminal Emulator ---
    const termInput = document.getElementById('terminal-input');
    const termOutput = document.querySelector('.terminal-output');
    const termBody = document.getElementById('terminal-body');

    if (termInput) {
        // Keep focus when clicking inside terminal body
        termBody.addEventListener('click', () => {
            termInput.focus();
        });

        termInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const command = this.value.trim().toLowerCase();

                // Echo command (escaped to prevent XSS)
                const safeValue = escapeHTML(this.value);
                termOutput.innerHTML += `<p><span class="prompt">guest@tsa-it-club:~$</span> <span class="term-cmd">${safeValue}</span></p>`;

                // Process command
                processCommand(command);

                // Reset input and scroll to bottom
                this.value = '';
                termBody.scrollTop = termBody.scrollHeight;
            }
        });

        function processCommand(cmd) {
            let response = '';
            switch (cmd) {
                case 'help':
                    response = `
                        <p class="term-system">Available commands:</p>
                        <p><span class="term-accent">about</span>    - Learn about the TSA IT Club</p>
                        <p><span class="term-accent">projects</span> - View our active projects</p>
                        <p><span class="term-accent">join</span>     - Open the membership application</p>
                        <p><span class="term-accent">clear</span>    - Clear the terminal screen</p>
                        <p><span class="term-accent">date</span>     - Show current date/time</p>
                    `;
                    break;
                case 'about':
                    response = '<p>We are a community of passionate builders, learning and creating the future of technology at TSA.</p>';
                    break;
                case 'projects':
                    response = '<p>Current active projects include <span class="term-accent">Attendance System</span>, <span class="term-accent">Cyber Sentinel</span>, and the <span class="term-accent">Discord Bot</span>. Scroll down to the Portfolio to see more!</p>';
                    break;
                case 'join':
                    response = '<p class="term-success">Opening membership application...</p>';
                    // Trigger modal
                    setTimeout(() => {
                        const modal = document.getElementById('join-modal');
                        if (modal) {
                            modal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }
                    }, 800);
                    break;
                case 'clear':
                    termOutput.innerHTML = '';
                    return; // exit early
                case 'date':
                    response = `<p>${new Date().toString()}</p>`;
                    break;
                case 'sudo rm -rf /':
                case 'sudo rm -rf':
                    response = '<p class="term-error">nice try hacker, but you do not have root privileges.</p>';
                    break;
                case '':
                    return; // Do nothing on empty enter
                default:
                    response = `<p class="term-error">Command not found: '${escapeHTML(cmd)}'. Type 'help' for a list of commands.</p>`;
            }
            termOutput.innerHTML += response;
        }
    }

    // --- 12. Premium 3D Tilt Effect for Desktop Glass Cards ---
    const tiltElements = document.querySelectorAll('.project-card, .board-card, .team-card, .about-card');

    // Only apply on non-touch devices (desktop) for performance and UX
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top; // y position within the element.

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate tilt. Adjust the divisor to control the intensity (higher = less tilt)
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                el.style.transform = `perspective(1000px) scale3d(1.02, 1.02, 1.02) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                el.style.transition = 'none'; // Remove transition during mouse move for immediate response
            });

            el.addEventListener('mouseleave', () => {
                // Smoothly return to original state
                el.style.transition = 'transform 0.5s ease-out';
                el.style.transform = 'perspective(1000px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)';
            });

            // Re-enable transition when entering to smooth out the initial jump
            el.addEventListener('mouseenter', () => {
                el.style.transition = 'transform 0.1s ease-out';
            });
        });
    }

    // --- 13. Back to Top Button Logic ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            // Show button after scrolling down 400px
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Global Cache Pre-fetcher ---
    if (window.SheetSync && typeof window.SheetSync.load === 'function') {
        const sectionsToFetch = ['events', 'blog', 'projects', 'resources', 'team'];
        sectionsToFetch.forEach(section => {
            window.SheetSync.load(section, () => {});
        });
    }

});
