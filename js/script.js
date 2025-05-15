/******/ (() => { // webpackBootstrap
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
const hamburger = document.querySelector(".hamburger");
const hamburger__toggle = document.querySelector(".hamburger__toggle");
const hamburger__inner = document.querySelector(".hamburger__inner");
const hamburger__line = document.querySelectorAll(".hamburger__line");
let hamburger_toggle_classList = hamburger__toggle.classList;
const previewListItem = document.querySelectorAll(".preview__list-item");
const previewMeals = document.querySelectorAll(".preview__meals");
const modal = document.querySelector(".modal");
const modalToggle = document.querySelectorAll("[data-modal]");
const modalClose = document.querySelector(".modal__close");
const deadline = "2025-04-29T09:36:00";
function hamburgerToggle() {
  hamburger__toggle.addEventListener("click", e => {
    e.preventDefault();
    if (hamburger_toggle_classList.contains("hamburger__toggle-active")) {
      hamburger__inner.classList.remove("hamburger__inner-active");
      hamburger__line.forEach(item => item.classList.remove("hamburger__line-active"));
      hamburger__toggle.classList.remove("hamburger__toggle-active");
    } else {
      hamburger__inner.classList.add("hamburger__inner-active");
      hamburger__line.forEach(item => item.classList.add("hamburger__line-active"));
      hamburger__toggle.classList.add("hamburger__toggle-active");
    }
  });
}
function switchPreviewMeals() {
  previewListItem.forEach((item, index) => {
    item.addEventListener("click", e => {
      e.preventDefault();
      previewListItem.forEach(item => item.classList.remove("preview__list-item-active"));
      previewListItem[index].classList.add("preview__list-item-active");
      previewMeals.forEach(item => item.classList.remove("preview__meals-active"));
      previewMeals[index].classList.add("preview__meals-active");
    });
  });
}
function getTimeRemaining(endtime) {
  const t = Date.parse(endtime) - Date.parse(new Date());
  let days, hours, minutes, seconds;
  if (t <= 0) {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
  } else {
    days = Math.floor(t / (1000 * 60 * 60 * 24)), hours = Math.floor(t / (1000 * 60 * 60) % 24), minutes = Math.floor(t / (1000 * 60) % 60), seconds = Math.floor(t / 1000 % 60);
  }
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}
function getZero(num) {
  if (num < 10) {
    return `0${num}`;
  } else {
    return num;
  }
}
function setClock(selector, endtime) {
  const timer = document.querySelector(selector),
    days = timer.querySelector("#days"),
    hours = timer.querySelector("#hours"),
    minutes = timer.querySelector("#minutes"),
    seconds = timer.querySelector("#seconds");
  const timerId = setInterval(updateClock, 1000);
  updateClock();
  function updateClock() {
    const t = getTimeRemaining(endtime);
    days.innerHTML = `<span>${getZero(t.days)}</span> дней`;
    hours.innerHTML = `<span>${getZero(t.hours)}</span> часов`;
    minutes.innerHTML = `<span>${getZero(t.minutes)}</span> минут`;
    seconds.innerHTML = `<span>${getZero(t.seconds)}</span> секунд`;
    if (t.total <= 0) {
      clearInterval(timerId);
    }
  }
}
function openModal() {
  modal.classList.add("modal__active");
  modal.querySelector(".modal__inner").classList.add("modal__inner-active");
  clearInterval(modalTimerId);
}
function closeModal() {
  modal.classList.remove("modal__active");
}
document.addEventListener("keydown", e => {
  if (e.keyCode === 27) {
    closeModal();
  }
});
modal.addEventListener("click", e => {
  target = e.target.className;
  if (target === "modal__close" || target === "modal__overlay") {
    closeModal();
  }
});
modalToggle.forEach(item => {
  item.addEventListener("click", e => {
    e.preventDefault();
    openModal();
  });
});
function openModalByScroll() {
  if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
    openModal();
    window.removeEventListener("scroll", openModalByScroll);
  }
}
class Menu {
  constructor(src, alt, subtitle, descr, price, parentSelector, ...classes) {
    this.src = src;
    this.alt = alt;
    this.subtitle = subtitle;
    this.descr = descr;
    this.price = price;
    this.parentSelector = document.querySelector(parentSelector);
    this.classes = classes;
  }
  render() {
    const element = document.createElement("div");
    element.classList.add("menu__field-item");
    element.innerHTML = `
            <img src="${this.src}" alt="${this.alt}" class="menu__field-item-img">
            <div class="menu__field-item-subtitle" > ${this.subtitle} </div>
            <div class="menu__field-item-descr" > ${this.descr} </div>
            <div class="menu__field-item-divider"></div>
            <div class="menu__field-item-price" > 
                <div>Цена:</div>
                <div class="menu__field-item-total" > <span> ${this.price} </span> р/день  </div>
            </div>`;
    this.parentSelector.append(element);
  }
}


const forms = document.querySelectorAll("form");
const message = {
  loading: `icons/spinner.svg`,
  success: `<span style='color:green; font-size:24px' >\u2714</span> We will contact you soon`,
  fail: `<span style='color:red; font-size:24px'>\u2716</span> Something went wrong`
};




const postData  = async (url, data) => {
  const result = await fetch (url, {
    method: 'POST',
    body: data,
    headers: {
      'Content-type': 'application/json'
    }
  });

  return await result.json();
};


const getData  = async (url) => {
  const result = await fetch (url);

  if (!result.ok) {
    throw new Error (`Could not fetch ${url}. Status: ${result.status}`)
  };

  return result.json();
};

function changePostData (form) {
  
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    openModal();
    const messageElement = document.createElement('img');
    messageElement.classList.add('status');
    messageElement.src = message.loading;
    messageElement.cssText = `
      display: block;
      margin: 0 auto;
    
    `;
    form.insertAdjacentElement('afterend', messageElement);
    console.log(messageElement);
    const formData = new FormData(form);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));

    postData('http://localhost:3000/requests', jsonData)
    .then(() => {
      showThanksModal(message.success);
    })
    .catch(() => {
      showThanksModal(message.fail);
    })
    .finally(() => {
      messageElement.remove();
      form.reset();
    })


  });



  function showThanksModal (message) {
    const oldWindow = document.querySelector('.modal__inner');
    oldWindow.classList.remove('modal__inner-active');

    const newWindow = document.createElement('div');
    newWindow.classList.add('modal__inner', 'modal__inner-active');
    newWindow.innerHTML = `
      <h2 class="title modal__title"> ${message} </h2>
    `;

    document.querySelector('.modal__window').append(newWindow);
    setTimeout(() => {
      newWindow.remove();
      oldWindow.classList.add('modal__inner-active');
      closeModal();
    }, 3000);
  }


};

forms.forEach(form => changePostData(form));
getData('http://localhost:3000/menu')
.then (data => {
  data.forEach(({img, altimg, title, descr, price}) => {
    new Menu(
      img,
      altimg,
      title,
      descr,
      price,
      '.menu__field'
    ).render();


  });

});

















// ******************************************************************************************************************************

// forms.forEach(item => bindPostData(item));

// const postData = async (url, data) => {
//   const res = await fetch(url, {
//     method: "POST",
//     body: data,
//     headers: {
//       'Content-type': 'application/json'
//     }
//   });
//   return await res.json();
// };


// const getResource = async (url) => {
//   const res = await fetch(url);

//   if (!res.ok) {
//     throw new Error(`Could not fetch ${url}. Status: ${res.status}`);
//   };
//   return await res.json();
// }

// getResource('http://localhost:3000/menu')
// .then(data => {
//   data.forEach(({img, altimg, title, descr, price}) => {
//     new Menu(
//       img, 
//       altimg, 
//       title, 
//       descr, 
//       price, '.menu__field')
//       .render();
//   })
// });


// function bindPostData(form) {
//   form.addEventListener("submit", e => {
//     e.preventDefault();
//     const statusMessage = document.createElement("img");
//     statusMessage.style.cssText = `
//       display: block;
//       margin: 0 auto;`;
//     statusMessage.classList.add("status");
//     statusMessage.src = message.loading;
//     form.insertAdjacentElement("afterend", statusMessage);
//     const formData = new FormData(form);

//     const json = JSON.stringify(Object.fromEntries(formData.entries()));

//     postData('http://localhost:3000/requests', json)
//     .then (data => { 
//       console.log(data);
//       showThanksModal(message.success)
//     })
//     .catch(() => {
//       showThanksModal(message.fail)
//     })
//     .finally(() => {
//       form.reset();
//       statusMessage.remove();
//     })

//   });
//   function showThanksModal(message) {
//     const prevModalInner = document.querySelector(".modal__inner");
//     prevModalInner.classList.remove("modal__inner-active");
//     const thanksModal = document.createElement("div");
//     thanksModal.innerHTML = `
//     <h2 class="title modal__title">${message}</h2>
//     `;
//     thanksModal.classList.add("modal__inner", "modal__inner-active");
//     document.querySelector(".modal__window").append(thanksModal);
//     document.querySelector(".modal").classList.add("modal__active");
//     setTimeout(() => {
//       thanksModal.remove();
//       prevModalInner.classList.toggle("modal__inner-active");
//       closeModal();
//     }, 4000);
//   }
// };

// ******************************************************************************************************************************



const prev = document.querySelector('.offer__slider-prev');
const next = document.querySelector('.offer__slider-next');
const slides = document.querySelectorAll('.offer__slider-img');
const currentSlideNum = document.querySelector('.current__slider-num');
const totalSlideNum = document.querySelector('.total__slider-num');
const slidesField = document.querySelector('.offer__sliders');
const slidesWrapper = document.querySelector('.offer__slider-wrapper'),
width = Math.round(parseFloat(window.getComputedStyle(slidesWrapper).width));
let currentIndex = 1;
let offset = 0;
const sliderNavigation = document.querySelector('.offer__slider-navigation')
slides.forEach((slide, i) => {
  const sliderNavigationItem = document.createElement('div');
  sliderNavigationItem.classList.add('offer__slider-navigation-item');
  sliderNavigationItem.setAttribute('data-slide-to', i + 1);
  sliderNavigation.append(sliderNavigationItem);

});
const sliderNavigationItems = document.querySelectorAll('.offer__slider-navigation-item');




slidesField.style.width = 100 * slides.length + '%';
currentSlideNum.innerHTML = checkZero(currentIndex);
navigationChange(sliderNavigationItems, currentIndex -1);
// widthNum = width.replace(/\D/g, '');





function checkZero (num) {
  if (num < 10) {
    return `0${num}`
  } else {
    return num;
  }
};

function navigationChange (navigationItems, index) {
  navigationItems.forEach(item => item.classList.remove('offer__slider-navigation-item-active'));
  navigationItems[index].classList.add('offer__slider-navigation-item-active');

};




next.addEventListener('click', () => {
  if (offset === width * (slides.length - 1)) {
    offset = 0;
    currentIndex = 1;
  } else {
    offset += width
    currentIndex ++;
  };

  navigationChange(sliderNavigationItems, currentIndex - 1);
  currentSlideNum.innerHTML = checkZero(currentIndex);
  slidesField.style.transform = `translate(-${offset}px)`;
});



prev.addEventListener('click', () => {
  if (offset === 0) {
    offset = width * (slides.length - 1);
    currentIndex = slides.length;
  } else {
    offset -= width;
    currentIndex --;
  };

  navigationChange(sliderNavigationItems, currentIndex - 1);
  currentSlideNum.innerHTML = checkZero(currentIndex);
  slidesField.style.transform = `translate(-${offset}px)`
});



sliderNavigationItems.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    const slideTo = e.target.getAttribute('data-slide-to');
    offset = width * (slideTo - 1);

    
    currentIndex = slideTo;
    slidesField.style.transform = `translate(-${offset}px)`;

    navigationChange(sliderNavigationItems, slideTo - 1);
    currentSlideNum.innerHTML = checkZero(slideTo);

  });
});



window.addEventListener("scroll", openModalByScroll);
const modalTimerId = setTimeout(openModal, 3000);
setClock(".promotion__timer", deadline);
switchPreviewMeals();
hamburgerToggle();





/******/ })()
;
//# sourceMappingURL=script.js.map