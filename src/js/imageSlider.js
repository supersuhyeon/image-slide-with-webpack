export default class ImageSlider {
  #currentPosition = 0; //현재 몇번째 슬라이더에 있는지
  #sliderNumber = 0; //슬라이드개수
  #sliderWidth = 0;
  #intervalId;
  #autoPlay = true;

  sliderWrapEl;
  sliderListEl;
  nextBtnEl;
  prevBtnEl;
  indicatorWrapEl;
  controlWrapEl;

  constructor() {
    this.assignElement();
    this.initSliderNumber();
    this.initSliderWidth();
    this.initSliderListWidth();
    this.addEvent();
    this.createIndicator();
    this.setIndicator();
    this.initAutoplay();
  }

  assignElement() {
    this.sliderWrapEl = document.querySelector(".slider-wrap"); //div
    this.sliderListEl = this.sliderWrapEl.querySelector("#slider"); //ul
    this.nextBtnEl = this.sliderWrapEl.querySelector("#next");
    this.prevBtnEl = this.sliderWrapEl.querySelector("#previous");
    this.indicatorWrapEl = this.sliderWrapEl.querySelector("#indicator-wrap"); //div
    this.controlWrapEl = this.sliderWrapEl.querySelector("#control-wrap"); //div
  }

  initAutoplay() {
    this.#intervalId = setInterval(() => {
      this.moveToRight();
    }, 3000); //setinterval은 아이디를 남긴다
  }

  initSliderNumber() {
    //슬라이드 넘버 초기화, 동적으로 만드니까 슬라이드 몇갠지 파악하고 시작
    this.#sliderNumber = this.sliderListEl.querySelectorAll("li").length; //ul>li*7
  }

  initSliderWidth() {
    //슬라이드 넓이 초기화
    this.#sliderWidth = this.sliderWrapEl.clientWidth;
  }

  initSliderListWidth() {
    //ul 전체길이
    this.sliderListEl.style.width = `${
      this.#sliderNumber * this.#sliderWidth
    }px`;
  }

  addEvent() {
    this.nextBtnEl.addEventListener("click", () => {
      this.moveToRight();
    });
    this.prevBtnEl.addEventListener("click", () => {
      this.moveToLeft();
    });
    this.indicatorWrapEl.addEventListener("click", (e) => {
      //이벤트위임
      this.onClickIndicator(e);
    });
    this.controlWrapEl.addEventListener("click", (e) => {
      this.togglePlay(e);
    });
  }

  togglePlay(e) {
    //클릭이되면 pause와 play를 토글
    //포즈일때는 클리어 인터버 어토플레이 false, 플레이를 누르면 셋인터버 어토플레이 true
    if (e.target.dataset.status === "play") {
      this.#autoPlay = true;
      this.controlWrapEl.classList.add("play");
      this.controlWrapEl.classList.remove("pause");
      this.initAutoplay();
    } else if (e.target.dataset.status === "pause") {
      this.#autoPlay = false;
      this.controlWrapEl.classList.remove("play");
      this.controlWrapEl.classList.add("pause");
      clearInterval(this.#intervalId);
    }
  }

  onClickIndicator(e) {
    const indexPosition = parseInt(e.target.dataset.index, 10); //십진법으로 바꿈 스트링으로
    if (Number.isInteger(indexPosition)) {
      //정수면 실행시킬것
      this.#currentPosition = indexPosition;
      this.sliderListEl.style.left = `-${
        this.#sliderWidth * this.#currentPosition
      }px`;
    }
    this.setIndicator();
  }

  moveToRight() {
    this.#currentPosition += 1;
    if (this.#currentPosition === this.#sliderNumber) {
      //경계값처리
      this.#currentPosition = 0;
    }
    this.sliderListEl.style.left = `-${
      this.#sliderWidth * this.#currentPosition
    }px`;

    if (this.#autoPlay) {
      clearInterval(this.#intervalId);
      this.#intervalId = setInterval(() => {
        this.moveToRight();
      }, 3000); //버튼을 눌러도 삼초뒤에 지나가도록
    }
    this.setIndicator();
  }
  moveToLeft() {
    this.#currentPosition -= 1;
    if (this.#currentPosition === -1) {
      this.#currentPosition = this.#sliderNumber - 1; //경계값처리
    }
    this.sliderListEl.style.left = `-${
      this.#sliderWidth * this.#currentPosition
    }px`;

    if (this.#autoPlay) {
      clearInterval(this.#intervalId);
      this.#intervalId = setInterval(() => {
        this.moveToRight();
      }, 3000); //버튼을 눌러도 삼초뒤에 지나가도록
    }
    this.setIndicator();
  }

  createIndicator() {
    //인디케이터 동적 생성
    const docFragment = document.createDocumentFragment();
    for (let i = 0; i < this.#sliderNumber; i += 1) {
      const li = document.createElement("li");
      li.dataset.index = i;
      docFragment.appendChild(li);
    }
    this.indicatorWrapEl.querySelector("ul").appendChild(docFragment);
  }
  setIndicator() {
    //해당슬라이더 넘버에 맞는 인디케이터 컬러 활성화시키기
    this.indicatorWrapEl.querySelector("li.active")?.classList.remove("active");
    this.indicatorWrapEl
      .querySelector(`ul li:nth-child(${this.#currentPosition + 1})`)
      .classList.add("active"); //nthchild는 1부터시작
  }
}
