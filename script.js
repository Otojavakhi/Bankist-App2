'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const images = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const leftBtn = document.querySelector('.slider__btn--left');
const rightBtn = document.querySelector('.slider__btn--right');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(modal => modal.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', function (e) {
  // Old way to scroll on section

  // const s1coords = document
  //   .getElementById('section--1')
  //   // Getting Section Coordinates
  //   .getBoundingClientRect();

  // console.log(s1coords);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Better and Modern and short way to scroll on section!

  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////

// ----------- Event Delegation -----------------

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// ---- Better Way -----
// 1.Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//////////////////////////////////////////////

// Tabbed Component
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/////////////////////////////////////////////
// ----- Nav links Hover Effect

// Refactoring (creating one functions enstead dry)

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const logo = link.closest('.nav').querySelector('img');
    const navLinks = link.closest('.nav').querySelectorAll('.nav__link');

    navLinks.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));
////////////////////////////////////////////

// -----------Sticky Nav -------------- (IntersectionObserver)
// for Responsive Web
const navHeight = nav.getBoundingClientRect().height;
////////////////////////////////////////////////////
const StickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const navObserver = new IntersectionObserver(StickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
navObserver.observe(header);

////////////////////////////////////////////
// ----- Reload Sections according screen position----- (IntersectionObserver)

const secCallBack = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  //For better Performance
  observer.unobserve(entry.target);
};
const secOptions = {
  root: null,
  threshold: 0.15,
};
const sectionObserver = new IntersectionObserver(secCallBack, secOptions);
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
////////////////////////////////////////////
// -------Lazy Load Images ----------

const realodImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //Replace src with data src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};
const imageObserver = new IntersectionObserver(realodImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
images.forEach(image => imageObserver.observe(image));

///////////////////////////////////////////

// ----------- Slider --------------
let curSlide = 0;
const maxSlide = slides.length;
const dotsContainer = document.querySelector('.dots');

const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activeDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }
  goToSlide(curSlide);
  activeDots(curSlide);
};

// If we want automatically next slide every 3 sec
// setInterval(function () {
//   nextSlide();
// }, 3000);
const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activeDots(curSlide);
};

rightBtn.addEventListener('click', nextSlide);
leftBtn.addEventListener('click', prevSlide);

// Slide with arrow keyboard

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

// Dots for Slider

const init = function () {
  goToSlide(0);
  createDots();
  activeDots(0);
};
init();

// ---------- Important -----------------
dotsContainer.addEventListener('click', function (e) {
  const slide = e.target.dataset.slide;
  goToSlide(slide);
  activeDots(slide);
});

//////////////////////////////////////////
// -----Experiments--------

// -----DOM Traversin------

// 1. Going Downwards: child

// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('.highlight')); // all elements with classnames .highlight inside h1
// console.log(h1.childNodes); // All node types inside h1
// console.log(h1.children); // All elements inside h1

// // 2. Going Upwards: parents
// console.log(h1.parentNode); // parent element of h1 as Node
// console.log(h1.parentElement); // parent element of h1 as Node
// // More Important
// console.log(h1.closest('.header')); // Finds parent element with class name .header.. No matter how far it is

// // 3. Going Sideways: siblings
// console.log(h1.previousElementSibling); // returns previous element of itseft if it has.. not Parent
// console.log(h1.nextElementSibling); // returns next element of itself if it has...

// // Access h1 all siblings using its parent element except h1
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.color = 'red';
// });
