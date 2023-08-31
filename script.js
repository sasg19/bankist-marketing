'use strict';
///////////////////////////////////////////////
//selectors
///////////////////////////////////////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnsopenmodal = document.querySelectorAll('.btn--show-modal');
const btnclosemodal = document.querySelector('.btn--close-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
//tabs components
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content ');
const nav = document.querySelector('.nav');
///////////////////////////////////////////
// Modal window
//////////////////////////////////////////

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsopenmodal.forEach(btn => btn.addEventListener('click', openModal));

btnclosemodal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  //if esc key is pressed and modal is visible
  if (e.key == 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////////////////
//page nvigation to sections
//////////////////////////////////////////////////
//using event delegation
//1.add event listner to common parent element
//2. determine what element that originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching if click is on child links and not parent
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
///////////////////////////////////////////////////
//sticky header menu
////////////////////////////////////////////////////

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
////////////////////////////////////////////////////
//menu fade animation
/////////////////////////////////////////////////////
//mouseenter doesnot bubble
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//we use bind to pass value to the handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));
////////////////////////////////////////////////////
//smooth scroll on clicking learn more
////////////////////////////////////////////////////
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();

  section1.scrollIntoView({ behavior: 'smooth' });
});
////////////////////////////////////////////////////
//reveal sections
////////////////////////////////////////////////////
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
//////////////////////////////////////////////////
//lazy loading images
////////////////////////////////////////////////
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  //replace src with data src
  entry.target.src = entry.target.dataset.src;
  //to remove the blur filter after the img is loaded
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '+200px',
});
imgTargets.forEach(img => imgObserver.observe(img));
//////////////////////////////////////////////
//impelement tabbed component
//////////////////////////////////////////////
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //guard close
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  //activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});
/////////////////////////////////////////////////
//slider
/////////////////////////////////////////////////

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const slbtnLeft = document.querySelector('.slider__btn--left');
const slbtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currSlide = 0;
const maxslide = slides.length - 1;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button class="dots__dot" data-slide="${i}" ></button>`
    );
  });
};

const activeDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const gotoSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (currSlide === maxslide) currSlide = 0;
  else currSlide++;
  gotoSlide(currSlide);
  activeDot(currSlide);
};
const prevSlide = function () {
  if (currSlide === 0) currSlide = maxslide;
  else currSlide--;
  gotoSlide(currSlide);
  activeDot(currSlide);
};
const init = function () {
  createDots();
  gotoSlide(0);
  activeDot(0);
};
init();
//to go to next slide
//event handlesr
slbtnRight.addEventListener('click', nextSlide);
slbtnLeft.addEventListener('click', prevSlide);
document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    gotoSlide(slide);
    activeDot(slide);
  }
});
//////////////////////////////////////////////////////////////
