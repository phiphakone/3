// ===== Progress bar & Nav dots =====
const progressBar = document.getElementById('progressBar');
const navDots = document.querySelectorAll('.nav-dots a');
const sections = document.querySelectorAll('.section');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';

  // Update active nav dot
  let current = 0;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2) {
      current = i;
    }
  });
  navDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

window.addEventListener('scroll', updateProgress);
updateProgress();

// Smooth scroll for nav dots
navDots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(dot.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== Reveal on scroll =====
const revealElements = document.querySelectorAll(
  '.card, .step, .complex-card, .code-panel, .student-table, .point, .thank-you, .compare-table-wrapper'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach(el => observer.observe(el));

// ===== Code tabs =====
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.code-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// ===== Array Visualizer =====
const steps = [
  {
    label: 'Ban đầu',
    values: [64, 25, 12, 22, 11],
    minIndex: -1,
    sortedUpTo: -1,
    explanation: 'Mảng ban đầu chưa được sắp xếp. Sẽ tìm phần tử nhỏ nhất và đưa về đầu.'
  },
  {
    label: 'Bước 1 – Tìm min',
    values: [64, 25, 12, 22, 11],
    minIndex: 4,
    sortedUpTo: -1,
    explanation: 'Tìm phần tử nhỏ nhất trong đoạn [0..4] → tìm thấy 11 tại vị trí 4.'
  },
  {
    label: 'Bước 1 – Đổi chỗ',
    values: [11, 25, 12, 22, 64],
    minIndex: -1,
    sortedUpTo: 0,
    explanation: 'Đổi 64 ↔ 11. Phần tử 11 đã đúng vị trí.'
  },
  {
    label: 'Bước 2 – Tìm min',
    values: [11, 25, 12, 22, 64],
    minIndex: 2,
    sortedUpTo: 0,
    explanation: 'Tìm phần tử nhỏ nhất trong đoạn [1..4] → tìm thấy 12 tại vị trí 2.'
  },
  {
    label: 'Bước 2 – Đổi chỗ',
    values: [11, 12, 25, 22, 64],
    minIndex: -1,
    sortedUpTo: 1,
    explanation: 'Đổi 25 ↔ 12. Phần tử 12 đã đúng vị trí.'
  },
  {
    label: 'Bước 3 – Tìm min',
    values: [11, 12, 25, 22, 64],
    minIndex: 3,
    sortedUpTo: 1,
    explanation: 'Tìm phần tử nhỏ nhất trong đoạn [2..4] → tìm thấy 22 tại vị trí 3.'
  },
  {
    label: 'Bước 3 – Đổi chỗ',
    values: [11, 12, 22, 25, 64],
    minIndex: -1,
    sortedUpTo: 2,
    explanation: 'Đổi 25 ↔ 22. Phần tử 22 đã đúng vị trí.'
  },
  {
    label: 'Bước 4 – Kiểm tra',
    values: [11, 12, 22, 25, 64],
    minIndex: 3,
    sortedUpTo: 2,
    explanation: 'Tìm phần tử nhỏ nhất trong đoạn [3..4] → 25 đã là nhỏ nhất, không cần đổi.'
  },
  {
    label: 'Hoàn tất',
    values: [11, 12, 22, 25, 64],
    minIndex: -1,
    sortedUpTo: 4,
    explanation: 'Mảng đã được sắp xếp tăng dần: 11, 12, 22, 25, 64.'
  }
];

let currentStep = 0;
const arrayState = document.getElementById('arrayState');
const stepLabel = document.getElementById('stepLabel');
const stepExplanation = document.getElementById('stepExplanation');
const prevBtn = document.getElementById('prevStep');
const nextBtn = document.getElementById('nextStep');

const maxHeight = 180; // px
const maxVal = 64;

function renderStep(idx) {
  const step = steps[idx];
  stepLabel.textContent = step.label;
  stepExplanation.textContent = step.explanation;

  arrayState.innerHTML = '';
  step.values.forEach((val, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'bar-wrapper';
    if (i === step.minIndex) wrapper.classList.add('min');
    if (i <= step.sortedUpTo) wrapper.classList.add('sorted');

    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = Math.max(18, (val / maxVal) * maxHeight) + 'px';

    const label = document.createElement('span');
    label.textContent = val;

    wrapper.appendChild(bar);
    wrapper.appendChild(label);
    arrayState.appendChild(wrapper);
  });

  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === steps.length - 1;
}

prevBtn.addEventListener('click', () => {
  if (currentStep > 0) {
    currentStep--;
    renderStep(currentStep);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentStep < steps.length - 1) {
    currentStep++;
    renderStep(currentStep);
  }
});

// Initial render
renderStep(0);

// Keyboard support for visualizer when in view
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft') prevBtn.click();
});
