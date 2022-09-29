"use strict";

///////////////////////////////////////
// Modal window
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const navLinks = document.querySelector(".nav__links");

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section_1 = document.querySelector("#section--1");

const operationsTab = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const contents = document.querySelectorAll(".operations__content");

const navBar = document.querySelector(".nav");

const section = document.querySelectorAll(".section");

const slide = document.querySelectorAll(".slide");
const sliderBtnLeft = document.querySelector(".slider__btn--left");
const sliderBtnRight = document.querySelector(".slider__btn--right");

//modal view
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((val) => val.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnScrollTo.addEventListener("click", function (e) {
  section_1.scrollIntoView({ behavior: "smooth" });
});

navLinks.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

tabContainer.addEventListener("click", function (e) {
  const clickedBtn = e.target.closest(".operations__tab");
  if (!clickedBtn) return;
  //all button don't get active when clicked all at same time
  operationsTab.forEach((e) => e.classList.remove("operations__tab--active"));

  clickedBtn.classList.add("operations__tab--active");

  //first remove content to show them all together on click ////////show content on button click

  contents.forEach((e) => e.classList.remove("operations__content--active"));

  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//fade animation on main menu

function fadingAnimation(e, opacity) {
  e.preventDefault();
  if (e.target.closest(".nav__link")) {
    const link = e.target;
    const sibling = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    sibling.forEach((el) => {
      if (el !== link) {
        el.style.opacity = `${opacity}`;
      }
    });
    logo.style.opacity = `${opacity}`;
  }
}
//for mouse hover
navBar.addEventListener("mouseover", (e) => fadingAnimation(e, 0.5));
// for mouse out
navBar.addEventListener("mouseout", (e) => fadingAnimation(e, 1));
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//sticky navigation bar usin intersectionOberserver API
const header = document.querySelector(".header");
const navBarHeight = navBar.getBoundingClientRect().height;

const headerFunc = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) navBar.classList.add("sticky");
  else navBar.classList.remove("sticky");
};
const headerObj = {
  root: null,
  threshold: 0,
  //rooMargin =>mtlab ki header 1 khtm hote hi shuru hoga to dusre section ki kafi jagha le le ga uss text vgaera uske niche show hoga agar usko fix karna h to rootMargin -90px karne sy 90px phle hi show ho jaye ki navbar varna header tag ki line end pr show hoti//

  rootMargin: `-${navBarHeight}px`,
};
const headerObserver = new IntersectionObserver(headerFunc, headerObj);
headerObserver.observe(header);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// adding sections a smooth fade-in animation when the get scroll in view-port

function fadeIn(entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");

  // so this API always observer the change we sepcify but if it obersve all of them 1-time then it should stop =>
  observerSections.unobserve(entry.target);
}

const observerSections = new IntersectionObserver(fadeIn, {
  root: null,
  threshold: 0.2,
});

section.forEach(function (section) {
  observerSections.observe(section);
  section.classList.add("section--hidden");
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//show img by loading == lazy loading img
const highResImg = document.querySelectorAll("img[data-src]");
const lazyImg = function (entries, observe) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //we use addEventListner on load because if we have slow internet the  shows only blur //otherwise it show low quality image we use its on us to decide  if you don't want that the nwe have to use this/
  entry.target.addEventListener("load", (el) =>
    entry.target.classList.remove("lazy-img")
  );

  // dataset => is defined in html of this img Attribute by name of data-src to-get this data-src in js we use dataset // and we get it by dataset.src//
  entry.target.src = entry.target.dataset.src;

  observerImg.unobserve(entry.target);
};

const observerImg = new IntersectionObserver(lazyImg, {
  root: null,
  threshold: 0,
  rootMargin: "100px",
});
//rootMargin use isliye kiya h ki user ko pta na chale ki niche low-quality img h phir vo high-quality my load hogi vo user k view port my aane sy phle hi load ho jaye//
highResImg.forEach((img) => observerImg.observe(img));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// adding sliders
const dotContainer = document.querySelector(".dots");
let curSlide = 0;
// creating dot sliders
function createDot() {
  slide.forEach((_, i) =>
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class='dots__dot' data-slide='${i}'></button>`
    )
  );
}
//which is  activeDot
function activeDot(slide) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((slide) => slide.classList.remove("dots__dot--active"));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
}
// fuction which will be called on button click of right slide or left slide
function goToSlide(curSlides) {
  slide.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - curSlides)}%)`)
  );
}

// go to next slide
const nextSlide = function () {
  if (slide.length - 1 === curSlide) {
    curSlide = 0;
    activeDot(0)
    goToSlide(0);
  } else {
    curSlide++;
    goToSlide(curSlide);
    activeDot(curSlide);
  }
};

//go to left slide
const previousSlide = function () {
  if (curSlide === 0) {
    curSlide = slide.length;
    
  }
  curSlide--;
  goToSlide(curSlide);
  activeDot(curSlide);
};
// IIFE 
const init =function (){
createDot();
activeDot(0);
goToSlide(0);}
init()
sliderBtnRight.addEventListener("click", nextSlide);
sliderBtnLeft.addEventListener("click", previousSlide);

// neft slide right slide scrolling on keyboard click leftArrow or rightArrow
document.addEventListener("keydown", function (e) {
  if (e.key == "ArrowRight") nextSlide();
  if (e.key == "ArrowLeft") previousSlide();
});

// slide on dot clicks
dotContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("dots__dot")) {
    const [slide] = e.target.dataset.slide;
    goToSlide(slide);
    activeDot(slide);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// completed ////////// completed  /////////////////// completed //////////////////////////  completed ///////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
