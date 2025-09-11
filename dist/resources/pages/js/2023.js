function examLayer(state = true){
  const examLayerEl = document.querySelector('#l-exam');
  if( !examLayerEl ){
    return;
  }

  examLayerEl.classList.toggle('is-active', state);
  document.body.classList.toggle('is-scroll-lock', state);
}


/**
 * 다음 문항으로 넘어가기 전, 이벤트 초기화 실행함수 (DOM 제거 전)
 * @param examInstanceName
 */

function examCleanUp(examInstanceName = 'EXAM_INSTANCE'){
  if( window[examInstanceName] ){
    window[examInstanceName]?.destroy();
    window[examInstanceName] = null;
  }
}

/**
 * [문제] 나열형(이미지,텍스트)
 */
class ExamOrdering {
  constructor(rootId) {
    this.rootId = rootId;
    this.init();
  }

  init() {
    this.build();
    this.bindEvents();
  }

  build() {
    this.wrapEl = document.getElementById(this.rootId);
    if (!this.wrapEl) {
      console.error("rootId 엘리먼트를 찾을 수 없습니다.");
      return;
    }

    this.buildState();
    this.cacheDom();
    this.cacheValue();
  }

  buildState() {
    const self = this;
    this._state = [];
    this.updatedView = this._debounced(this._updatedView.bind(this), 60);
    this.updatedResult = this._debounced(this._updatedResult.bind(this), 60);

    this.state = new Proxy(this._state, {
      set(target, property, value) {
        target[property] = value;
        self.updatedView(target);
        self.updatedResult(target);
        return true;
      }
    });
  }

  cacheDom() {
    this.el = {};
    this.el.view = this.wrapEl.querySelector('[data-js="exam-order__view"]');
    this.el.viewButtons = this.el.view.querySelectorAll('[data-js="exam-order__button"]');
    this.el.body = this.wrapEl.querySelector('[data-js="exam-order__body"]');
    this.el.result = this.el.body.querySelector('[data-js="exam-order__result"]');
    this.el.value = this.wrapEl.querySelector('[data-js="exam-value"]');
  }

  cacheValue() {
    this.viewMap = new Map();
    this.el.viewButtons.forEach(button => {
      const li = button.closest('li').cloneNode(true);
      this.viewMap.set(button.value, li);
    });
  }

  _updatedView() {
    this.el.viewButtons.forEach(el => {
      el.disabled = this.state.includes(el.value);
    })
  }

  _updatedResult() {
    this.el.body.hidden = !this.state.length;
    this.el.result.innerHTML = this.state.map(value => {
      const el = this.viewMap.get(value);
      return el?.outerHTML || '';
    }).join('')

    this.el.value.value = JSON.stringify(this.state)
  }

  addItem(value) {
    this.state.push(value);
  }

  removeItem(value) {
    const index = this.state.indexOf(value);
    if (index !== -1) {
      this.state.splice(index, 1);
    }
  }

  _debounced(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  _findEventElement(el, selector) {
    return el.matches(selector) ? el : el.closest(selector);
  }

  _handleClickViewItem({target}) {
    const buttonEl = this._findEventElement(target, '[data-js="exam-order__button"]')
    if (buttonEl && buttonEl?.value) {
      this.addItem(buttonEl.value);
    }
  }

  _handleClickResultItem({target}) {
    const buttonEl = this._findEventElement(target, '[data-js="exam-order__cancel"]')
    if (buttonEl && buttonEl?.value) {
      this.removeItem(buttonEl.value);
    }
  }

  bindEvents() {
    this.handleClickViewItem = this._handleClickViewItem.bind(this)
    this.handleClickResultItem = this._handleClickResultItem.bind(this)
    this.el.view.addEventListener('click', this.handleClickViewItem)
    this.el.result.addEventListener('click', this.handleClickResultItem)
  }

  unbindEvents() {
    this.el.view.removeEventListener('click', this.handleClickViewItem)
    this.el.result.removeEventListener('click', this.handleClickResultItem)
  }

  destroy() {
    this.unbindEvents();
    this.viewMap.clear();
    this.viewMap = null;
    this.el = null;
    this.state = null;
    this._state = null;
    this.wrapEl = null;
  }
}



class ExamLinkLine {
  constructor(wrapEl, callback) {
    this.wrapEl = wrapEl;
    if (!this.wrapEl) {
      console.error("rootId 엘리먼트를 찾을 수 없습니다.");
      return;
    }
    this.resultCallback = callback || function(){};

    this.init();
  }

  init() {
    this.build();
    this.bindEvents();
  }

  build() {
    this.cacheDom();
    this.buildCanvas();
    this.buildState();
  }

  cacheDom() {
    this.el = {};
    this.el.anchors = Array.from(
      this.wrapEl.querySelectorAll("button[data-side]")
    );
    this.el.cancels =  Array.from(
      this.wrapEl.querySelectorAll("button.exam-link-line__cancel")
    )
  }

  buildCanvas() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.el.svg = svg;
    this.resizeCanvas();
    this.wrapEl.appendChild(svg);
  }

  resizeCanvas() {
    const { width, height } = this.wrapEl.getBoundingClientRect();

    const attrs = {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`
    };

    for (const attr in attrs) {
      this.el.svg.setAttribute(attr, attrs[attr]);
    }
  }

  buildState() {
    const self = this;

    this._choice = [];
    this._result = [];

    this.updatedChoice = this._debounced(this._updatedChoice.bind(this), 60);
    this.updatedResult = this._debounced(this._updatedResult.bind(this), 60);

    this.choice = new Proxy(this._choice, {
      set(target, property, value) {
        target[property] = value;
        self.updatedChoice(target);
        return true;
      }
    });

    this.result = new Proxy(this._result, {
      set(target, property, value) {
        target[property] = value;
        self.updatedResult(target);
        return true;
      }
    });
  }

  getAnchorsCoord() {
    const anchorsCoord = {};

    const { left: rootX, top: rootY } = this.wrapEl.getBoundingClientRect();

    this.el.anchors.forEach((el) => {
      const id = el.dataset.id;
      const { top, left, width, height } = el.querySelector('i').getBoundingClientRect();
      const x = left - rootX + width / 2;
      const y = top - rootY + height / 2;
      anchorsCoord[id] = { x, y };
    });

    return anchorsCoord;
  }

  makeLinesHtml(linesCoord) {
    const html = [];

    linesCoord.forEach(({ x1, x2, y1, y2 }) => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      const attrs = {
        x1,
        y1,
        x2,
        y2,
        strokeWidth: 1,
        stroke: "#a09fa0"
      };

      for (const attr in attrs) {
        line.setAttribute(attr, attrs[attr]);
      }

      html.push(line);
    });

    return html;
  }

  updateButtonStatus(){
    const disabledIds = this.result.map(([r, l]) => r);

    const rightAnchors = this.el.anchors.filter(el => el.dataset.side==='r');

    rightAnchors.forEach(el => {
      const id = el.dataset.id;
      const result = this.result.find(([r,l]) => r === id);
      const pairedText = result ? `(${result[1]})` : '';

      el.disabled = disabledIds.includes(id);
      el.querySelector('.exam-link-line__paired').textContent = pairedText;
    })
  }

  render() {
    const anchorsCoord = this.getAnchorsCoord();

    const linesCoord = this.result.map(([a, b]) => {
      return {
        x1: anchorsCoord[a].x,
        y1: anchorsCoord[a].y,
        x2: anchorsCoord[b].x,
        y2: anchorsCoord[b].y
      };
    });

    const html = this.makeLinesHtml(linesCoord);

    this.el.svg.innerHTML = "";
    this.el.svg.append(...html);
  }

  sortPairId(arr = []) {
    const clonedArr = structuredClone(arr);

    clonedArr.sort((a, b) => {
      if (a.side > b.side) return -1;
      if (a.side < b.side) return 1;
      return 0;
    });

    return clonedArr.map((o) => o.id);
  }

  addData(data) {
    const [primary, secondary] = this.sortPairId(data);

    const savedPair = this.result.find(([_primary, _secondary]) => {
      if (_primary === primary && _secondary === secondary) {
        return true;
      }
      return false;
    });

    if (savedPair) {
      return;
    }

    this.result.push([primary, secondary]);

    return this.result;
  }

  removeData(data) {
    const [primary, secondary] = this.sortPairId(data);

    const filteredPair = this.result.filter(([_primary, _secondary]) => {
      if (_primary === primary && _secondary === secondary) {
        return false;
      }
      return true;
    });

    this.result.length = 0;
    this.result.concat(filteredPair);

    return this.result;
  }

  _debounced(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  _updatedChoice(data) {
    const ids = [...data].map((o) => o.id);

    this.el.anchors.forEach((anchor) => {
      anchor.classList.toggle("is-active", ids.includes(anchor.dataset.id));
    });
    this.log();
  }

  _updatedResult(data) {
    this.render();
    this.updateButtonStatus()
    this.resultCallback(this.result)
    this.log();
  }

  _handleClickAnchor({ target }) {

    const el = this._findEventElement(target, '.exam-link-line__button')

    if (!el) {
      return;
    }

    const { side, id } = el.dataset;

    if (this.choice.length) {
      const savedChoice = this.choice.at(0);
      if (savedChoice.id === id) {
        this.choice.length = 0;
        return;
      } else if (savedChoice.side !== side) {
        this.addData([...this.choice, { side, id }]);
        this.choice.length = 0;
        return;
      }
    }

    this.choice.length = 0;
    this.choice.push({ side, id });
  }

  _handleClickCancel({target}){
    if (!this.el.cancels.includes(target)) {
      return;
    }

    const parentEl = target.closest('.exam-link-line__item');

    const id = parentEl.querySelector('button[data-id]').dataset?.id
    if(id){

      const index = this.result.findIndex(([r, l]) => {
        return r === id
      })
      this.result.splice(index,1);
      this.choice.length = 0;
    }
  }

  _handleResize() {
    this.resizeCanvas();
    this.render();
  }

  _findEventElement(el, selector) {
    return el.matches(selector) ? el : el.closest(selector);
  }

  bindEvents() {
    this.handleClickAnchor = this._handleClickAnchor.bind(this);
    this.handleClickCancel = this._handleClickCancel.bind(this);
    this.handleResize = this._debounced(this._handleResize, 16);

    this.wrapEl.addEventListener("click", this.handleClickAnchor);
    this.wrapEl.addEventListener("click", this.handleClickCancel);
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.wrapEl);
  }

  destroy(){
    this.unbindEvents();
    this.choice = null;
    this.result = null;
    this._choice = null;
    this._result = null;
    this.el = null;
    this.wrapEl = null;
  }

  unbindEvents() {
    this.wrapEl.removeEventListener("click", this.handleClickAnchor);
    this.wrapEl.removeEventListener("click", this.handleClickCancel);
    this.resizeObserver?.disconnect();
  }

  log() {
//     document.getElementById("log").innerHTML = `
// choice
//   ${JSON.stringify(this.choice)}
// <br />
// result
//   ${JSON.stringify(this.result)}
//     `;
  }
}

class ExamLinkList {
  constructor(wrapEl, callback) {
    this.wrapEl = wrapEl;
    if (!this.wrapEl) {
      console.error("rootId 엘리먼트를 찾을 수 없습니다.");
      return;
    }
    this.resultCallback = callback || function(){};

    this.init();
  }

  init() {
    this.build();
    this.bindEvents();
  }

  build() {
    this.cacheDom();
    this.buildState();
  }

  cacheDom() {
    this.el = {};
    this.el.groups = Array.from(
      this.wrapEl.querySelectorAll(".select-group")
    )
  }

  buildState() {
    const self = this;

    this._result = [];

    this.updatedResult = this._debounced(this._updatedResult.bind(this), 60);

    this.result = new Proxy(this._result, {
      set(target, property, value) {
        target[property] = value;
        self.updatedResult(target);
        return true;
      }
    });
  }

  addData(arr){
    this.result.push(arr)
  }

  removeData(id){
    const index = this.result.findIndex(([key]) => key === id);
    this.result.splice(index,1);
  }

  _updatedResult(){
    this.el.groups.forEach(groupEl => {
      const groupId = groupEl.dataset?.id;
      if( groupId ){
        const matchedData = this.result.find(([key]) => key === groupId)
        if( matchedData ){
          const [key,value] = matchedData;
          const itemEls = Array.from(groupEl.querySelectorAll('.select-group__item'));
          const itemEl = itemEls.find(el => el.dataset.id === value)

          if( !!itemEl ){
            groupEl.classList.remove('is-expanded')
          }
          groupEl.classList.toggle('is-selected', !!itemEl)
          itemEls.forEach(el => {
            el.classList.toggle('is-selected',el.dataset?.id === value)
          })
        } else {
          groupEl.classList.remove('is-selected')
        }
      }
    })

    this.resultCallback(this.result);

    this.log();
  }

  _handleClickToggle({target}){
    if(!target.classList.contains('select-group__toggle')){
      return;
    }

    const targetGroup = target.closest('.select-group');
    this.el.groups.forEach(group => {
      if(group === targetGroup){
        targetGroup.classList.toggle('is-expanded');
      } else {
        group.classList.remove('is-expanded');
      }
    })
  }

  _handleClickItem({target}){
    const el = this._findEventElement(target, '.select-group__content');
    if(el) {
      const groupId = el.closest('.select-group')?.dataset?.id
      const itemId = el.closest('.select-group__item')?.dataset?.id;
      if(groupId && itemId){
        this.addData([groupId, itemId]);
      }
    }
  }

  _handleClickCancel(event){
    const el = this._findEventElement(event.target, '.select-group__cancel');
    if(el){
      const group = el.closest('.select-group');
      if( group ){
        this.removeData(group.dataset?.id)
        group.classList.add('is-expanded');
      }
		
    }
  }

  _debounced(func, delay) {
    let timeoutId;

    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  _findEventElement(el, selector) {
    return el.matches(selector) ? el : el.closest(selector);
  }

  bindEvents(){

    this.handleClickToggle = this._handleClickToggle.bind(this);
    this.handleClickItem = this._handleClickItem.bind(this);
    this.handleClickCancel = this._handleClickCancel.bind(this);

    this.wrapEl.addEventListener('click',this.handleClickToggle)
    this.wrapEl.addEventListener('click',this.handleClickItem)
    this.wrapEl.addEventListener('click',this.handleClickCancel)
  }
  unbindEvents(){
    this.wrapEl.removeEventListener('click',this.handleClickToggle)
    this.wrapEl.removeEventListener('click',this.handleClickItem)
    this.wrapEl.removeEventListener('click',this.handleClickCancel)
  }

  destroy(){
    this.unbindEvents();
    this.result = null;
    this._result = null;
    this.el = null;
    this.wrapEl = null;
  }

  log() {
//     document.getElementById("log").innerHTML = `
// result
//   ${JSON.stringify(this.result)}
//     `;
  }

}


class ExamLink {
  constructor(rootId) {
    this.rootId = rootId;
    this.instance = null;
    this.isMobile = false;
    this.init();
  }

  init(){
    this.wrapEl = document.getElementById(this.rootId);
    if (!this.wrapEl) {
      console.error("rootId 엘리먼트를 찾을 수 없습니다.");
      return;
    }
    this.resultEl = this.wrapEl.querySelector('input[data-js="exam-value"]');

    this.isMobile = window.innerWidth < 1024;
    this.wrapEl.classList.add( this.isMobile ? 'is-mobile' : 'is-desktop' );

    const callback = (result) => {
      this.resultEl.value = JSON.stringify(result)
    };

    if(this.isMobile){
      const listWrapEl = this.wrapEl.querySelector('[data-js="js-exam-link-list"]');
      this.instance = new ExamLinkList(listWrapEl, callback)
    } else {
      const lineWrapEl = this.wrapEl.querySelector('[data-js="js-exam-link-line"]');
      this.instance = new ExamLinkLine(lineWrapEl, callback)
    }
  }

  destroy(){
    if( this.instance ){
      this.instance?.destroy();
      this.instance = null;
    }
  }
}
