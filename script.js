// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links a');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
});

navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// Active section highlighting on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

// Contact form validation + Web3Forms submission
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const messageError = document.getElementById('messageError');

function showError(input, errorEl) {
    input.classList.add('error');
    errorEl.classList.add('visible');
}

function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.classList.remove('visible');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length > 0) clearError(nameInput, nameError);
});

emailInput.addEventListener('input', () => {
    if (validateEmail(emailInput.value.trim())) clearError(emailInput, emailError);
});

messageInput.addEventListener('input', () => {
    if (messageInput.value.trim().length >= 10) clearError(messageInput, messageError);
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    if (nameInput.value.trim().length === 0) {
        showError(nameInput, nameError);
        valid = false;
    }

    if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, emailError);
        valid = false;
    }

    if (messageInput.value.trim().length < 10) {
        showError(messageInput, messageError);
        valid = false;
    }

    if (!valid) {
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formFeedback.style.display = 'none';
    formFeedback.style.color = '';

    try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (response.ok && result.success) {
            formFeedback.textContent = "Message sent! I'll get back to you soon.";
            formFeedback.style.color = '#2A3EDB';
            contactForm.reset();
            [nameInput, emailInput, messageInput].forEach(i => clearError(i, nameError));
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (err) {
        formFeedback.textContent = 'Something went wrong, please try again or email me directly.';
        formFeedback.style.color = '#d64545';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
        formFeedback.style.display = 'block';
    }
});
