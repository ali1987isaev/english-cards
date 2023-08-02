const INITIAL_DATA_PATH = 'data.json';

const cardsOutput = document.querySelector('[data-cards-container]'),
  form = document.querySelector('[data-add-form]'),
  inputEN = document.querySelector('[data-input-en]'),
  inputRU = document.querySelector('[data-input-ru]'),

  slidesContainer = document.querySelector('[data-cards-container]'),
  prevButton = document.querySelector('[data-slide-arrow-prev]'),
  nextButton = document.querySelector('[data-slide-arrow-next]'),
  counter = document.querySelector('[data-slider-counter]'),
  renderNumber = document.querySelector('[data-render-number]'),
  numberOutput = document.querySelector('[data-number-output]'),
  numberVoice = document.querySelector('[data-number-voice]'),
  reverseButton = document.querySelector('[data-reverse]'),
  languageContainer = document.querySelector('[data-language]'),
  addButton = document.querySelector('[data-input-add]');

let slideIndex = 0;
let arr;

const deleteIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>';
const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="play-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" /></svg>'

const updateCounter = (total, index) => counter.textContent = `${index+1} / ${total}`;

const seyMessage = (message, reload = true) => {
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(`${message}`);
  utterThis.lang = "en-US";
  utterThis.rate = 0.8;
  synth.speak(utterThis);
  reload ? location.reload() : null;
}

const controllSlider = (button) => {
  button.disabled = true;
  setTimeout(() => {
    button.disabled = false;
  }, 700);
};

const onSliderChange = (button, allSlides) => {
  if (button.classList.contains('arrow-next')) {
    slidesContainer.scrollLeft += allSlides[0].clientWidth;
    if( slideIndex + 1 < allSlides.length) {
      slideIndex++;
      updateCounter(allSlides.length, slideIndex);
    } 
  } else {
    slidesContainer.scrollLeft -= allSlides[0].clientWidth
    if (slideIndex > 0) {
      slideIndex--;
      updateCounter(allSlides.length, slideIndex);
    }
  }
  
  controllSlider(button);
};

const initSlider = () => {
  let allSlides = document.querySelectorAll(".slide");
  slideIndex = 0;
  updateCounter(allSlides.length, slideIndex);
  nextButton.addEventListener("click", () => onSliderChange(nextButton, allSlides));
  prevButton.addEventListener("click", () => onSliderChange(prevButton, allSlides));
};

const deleteCard = (text) => {
  const newArr = arr.filter(el => el.en !== text);
  JSON.parse(window.localStorage.getItem('topic')) && JSON.parse(window.localStorage.getItem('topic')) === "expressions"
    ? window.localStorage.setItem('allExpressions', JSON.stringify(newArr))
    : window.localStorage.setItem('allWords', JSON.stringify(newArr));

  renderCards();
  location.reload();
};

const deleteCardEvent = (e) => {
  const button = e.target.classList.contains('delete-card')
    ? e.target
    : e.target.parentElement.classList.contains('delete-card')
      ? e.target.parentElement
      : e.target.parentElement.parentElement.classList.contains('delete-card')
        ? e.target.parentElement.parentElement
        : null;

  if(confirm("Are you sure you want to delete this card?")) {
    deleteCard(button.title);
    button.removeEventListener('click', deleteCardEvent);
  }
};

const deleteHandler = () => {
  const deleteButtons = document.querySelectorAll('[data-delete-card]');
  deleteButtons.forEach(button => button.addEventListener('click', deleteCardEvent));
};

const addCardEvents = () => {
  const cards = document.querySelectorAll('[data-word-card]')
  deleteHandler();

  cards.forEach(card => card.addEventListener('click', (el) => {
    if (
      el.target.classList.contains('card__play')
      || el.target.parentElement.classList.contains('card__play')
      || el.target.parentElement.parentElement.classList.contains('card__play')
      || el.target.classList.contains('delete-card')
      || el.target.parentElement.classList.contains('delete-card')
      || el.target.parentElement.parentElement.classList.contains('delete-card')
    ) return;
    card.classList.toggle('flipped');
  }));
};

const addVoice = () => {
  const playButtons = document.querySelectorAll('[data-audio-play]');

  playButtons.forEach(button => button.addEventListener('click', ()=> {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(button.title);
    button.name === "en" ? utterThis.lang = "en-US" : utterThis.lang = "ru";
    utterThis.rate = 0.8;
    synth.speak(utterThis);
    button.disabled = true;
    utterThis.addEventListener('end', () => button.disabled = false);
  }))
};

const showArray = () => {
  console.log(`
  'expressions': ${window.localStorage.getItem('allExpressions')}

  'words': ${window.localStorage.getItem('allWords')}
  `)
}

const renderCards = () => {
  JSON.parse(window.localStorage.getItem('topic')) && JSON.parse(window.localStorage.getItem('topic')) === "expressions"
    ? arr = JSON.parse(window.localStorage.getItem('allExpressions'))
    : arr = JSON.parse(window.localStorage.getItem('allWords'));

  // showArray();
  let html = '';

  arr.forEach(card => (
    html += `<li class="slide">
      <div class="deck">
        <div class="card clickcard" data-word-card>
          <div class="front face ${JSON.parse(window.localStorage.getItem('topic')) !== "words" ? "exp" : null}">
            <h1>${card.en}</h1>
            <button class="card__play" type="button" data-audio-play title="${card.en}" name="en">${playIcon}</button>
            <button class="delete-card" type="button" title="${card.en}" data-delete-card>${deleteIcon}</button>
          </div>
          <div class="back face ${JSON.parse(window.localStorage.getItem('topic')) !== "words" ? "exp" : null}">
            <h1>${card.ru}</h1>
            <button class="card__play" type="button" data-audio-play title="${card.ru}" name="ru">${playIcon}</button>
            <button class="delete-card" type="button" title="${card.en}" data-delete-card>${deleteIcon}</button>
          </div>
        </div>
      </div>
    </li>`
  ));

  cardsOutput.innerHTML = html;
  addCardEvents();
  initSlider();
  addVoice();
}

const getData = () => {
  fetch(INITIAL_DATA_PATH)
    .then(res => res.json())
    .then(data => {
      window.localStorage.setItem('allWords', JSON.stringify(data));
      renderCards();
    })
};

const createCard = (e) => {
  if (!inputEN.value || !inputRU.value) {
    e.preventDefault();
    return;
  };

  let cardsArray = JSON.parse(window.localStorage.getItem('topic')) === "words"
    ? JSON.parse(window.localStorage.getItem('allWords'))
    : JSON.parse(window.localStorage.getItem('allExpressions'));

  const updatedCardsArray = [{en: inputEN.value, ru: inputRU.value}, ...cardsArray];

  JSON.parse(window.localStorage.getItem('topic')) === "words"
    ? window.localStorage.setItem('allWords', JSON.stringify(updatedCardsArray))
    : window.localStorage.setItem('allExpressions', JSON.stringify(updatedCardsArray));
  renderCards();
  inputEN.value = '';
  inputRU.value = '';
};

const getNumberVoice = () => seyMessage(numberOutput.textContent, false);

const generateNumber = () => {
  const randomNumber = Math.floor(Math.random() * 100);
  numberOutput.innerText = randomNumber;
};

const renderAllWords = () => {
  if (JSON.parse(window.localStorage.getItem('topic')) === "words") return;

  window.localStorage.setItem('topic', JSON.stringify('words'));
  !JSON.parse(window.localStorage.getItem('allWords')) ? getData() : renderCards();
  seyMessage('all words');
};

const getExpressions = () => {
  fetch('expressions.json')
    .then(res => res.json())
    .then(data => {
      window.localStorage.setItem('allExpressions', JSON.stringify(data));
      renderCards();
    })
};

const renderAllExpressions = () => {
  if (JSON.parse(window.localStorage.getItem('topic')) === "expressions") return;
  
  window.localStorage.setItem('topic', JSON.stringify('expressions'));
  !JSON.parse(window.localStorage.getItem('allExpressions')) ? getExpressions() : renderCards();
  seyMessage('all expressions');
};

const setTopicHandler = (wordsBtn, expressionsBtn) => {
  const state = JSON.parse(window.localStorage.getItem('topic'));
  const heading = document.querySelector('[data-heading]');
  heading.textContent = state;

  if (state === 'words') {
    wordsBtn.classList.add('active')
    expressionsBtn.classList.contains('active') ? expressionsBtn.classList.remove('active') : null;
  } else {
    expressionsBtn.classList.add('active')
    wordsBtn.classList.contains('active') ? wordsBtn.classList.remove('active') : null;
  }
}

const changeTopic = () => {
  const allWords = document.querySelector('[data-all-works]');
  const allExpressions = document.querySelector('[data-all-expressions]');

  allWords.addEventListener('click', renderAllWords)
  allExpressions.addEventListener('click', renderAllExpressions)
  setTopicHandler(allWords, allExpressions);
};

const languageHandler = () => {
  const language = JSON.parse(window.localStorage.getItem('reverse'));
  const icon = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>'
  language === 'en'
    ? languageContainer.innerHTML = `<span>English</span> ${icon} <span>Russian</span>`
    : languageContainer.innerHTML = `<span>Russian</span> ${icon} <span>English</span>`;

  JSON.parse(window.localStorage.getItem('topic')) === "words"
    ? addButton.value = 'add word'
    : addButton.value = 'add expression';
}

const reverseCardsHandler = () => {
  const language = JSON.parse(window.localStorage.getItem('reverse'));
  language === 'en'
    ? null
    : document.querySelectorAll('.card').forEach(card => card.classList.toggle('flipped'));
}

const reverseCards = () => {
  document.querySelectorAll('.card').forEach(card => card.classList.toggle('flipped'));

  const language = JSON.parse(window.localStorage.getItem('reverse'));
  language === 'en'
    ? window.localStorage.setItem('reverse', JSON.stringify('ru'))
    : window.localStorage.setItem('reverse', JSON.stringify('en'));

  languageHandler();
};

// initial events
const init = () => {
  JSON.parse(window.localStorage.getItem('topic')) && JSON.parse(window.localStorage.getItem('topic')) === "expressions"
    ? !JSON.parse(window.localStorage.getItem('allExpressions')) ? getData() : renderCards()
    : !JSON.parse(window.localStorage.getItem('allWords')) ? getData() : renderCards();
  
  changeTopic();
  form.addEventListener('submit', createCard);
  renderNumber.addEventListener('click', generateNumber);
  numberVoice.addEventListener('click', getNumberVoice);
  !window.localStorage.getItem('reverse') 
    ? window.localStorage.setItem('reverse', JSON.stringify('en'))
    : null;
  reverseButton.addEventListener('click', reverseCards);
  reverseCardsHandler();
  languageHandler();
}

document.addEventListener("DOMContentLoaded", () => init());
