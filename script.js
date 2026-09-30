(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='projector.css';document.head.appendChild(l);}());
const progressBar = document.getElementById('progressBar');
const navDots = document.querySelectorAll('.nav-dots a');
const sections = document.querySelectorAll('.section');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (scrollTop / docHeight) * 100 + '%';
  let current = 0;
  sections.forEach((sec, i) => { if (sec.getBoundingClientRect().top <= window.innerHeight / 2) current = i; });
  navDots.forEach((dot, i) => dot.classList.toggle('active', i === current));
}
window.addEventListener('scroll', updateProgress); updateProgress();
navDots.forEach(dot => {
  dot.addEventListener('click', e => { e.preventDefault(); document.querySelector(dot.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' }); });
});
const revealElements = document.querySelectorAll('.card, .step, .complex-card, .code-panel, .student-table, .point, .thank-you, .compare-table-wrapper');
revealElements.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = Math.min(i % 4, 3) * 0.08 + 's'; });
const observer = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(el => observer.observe(el));
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.code-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});
const steps = [
  { label: 'Ban đầu', values: [64,25,12,22,11], highlight: [], sortedUpTo: -1, explanation: 'Mảng ban đầu: 64, 25, 12, 22, 11.' },
  { label: 'Bước 1', values: [11,25,12,22,64], highlight: [0], sortedUpTo: 0, explanation: 'Tìm min=11, đổi với 64.' },
  { label: 'Bước 2', values: [11,12,25,22,64], highlight: [1], sortedUpTo: 1, explanation: 'Tìm min=12 trong đoạn còn lại, đổi với 25.' },
  { label: 'Bước 3', values: [11,12,22,25,64], highlight: [2], sortedUpTo: 2, explanation: 'Tìm min=22, đổi với 25.' },
  { label: 'Bước 4', values: [11,12,22,25,64], highlight: [3], sortedUpTo: 3, explanation: '25 < 64, không đổi.' },
  { label: 'Hoàn tất', values: [11,12,22,25,64], highlight: [], sortedUpTo: 4, explanation: 'Mảng đã sắp: 11, 12, 22, 25, 64' }
];
let currentStep = 0;
const arrayState = document.getElementById('arrayState');
const stepLabel = document.getElementById('stepLabel');
const stepExplanation = document.getElementById('stepExplanation');
const prevBtn = document.getElementById('prevStep');
const nextBtn = document.getElementById('nextStep');
const maxVal = 64;
function renderStep(idx) {
  if (!arrayState) return;
  const step = steps[idx];
  stepLabel.textContent = step.label;
  stepExplanation.textContent = step.explanation;
  arrayState.innerHTML = '';
  step.values.forEach((val, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'bar-wrapper';
    if (step.highlight.includes(i)) wrapper.classList.add('min');
    if (i <= step.sortedUpTo) wrapper.classList.add('sorted');
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.height = Math.max(22, (val / maxVal) * 180) + 'px';
    const label = document.createElement('span');
    label.textContent = val;
    wrapper.appendChild(bar); wrapper.appendChild(label);
    arrayState.appendChild(wrapper);
  });
  prevBtn.disabled = idx === 0;
  nextBtn.disabled = idx === steps.length - 1;
}
if (prevBtn && nextBtn) {
prevBtn.addEventListener('click', () => { if (currentStep > 0) { currentStep--; renderStep(currentStep); } });
nextBtn.addEventListener('click', () => { if (currentStep < steps.length - 1) { currentStep++; renderStep(currentStep); } });
document.addEventListener('keydown', e => { if (e.key === 'ArrowRight') nextBtn.click(); if (e.key === 'ArrowLeft') prevBtn.click(); });
renderStep(0);
}
