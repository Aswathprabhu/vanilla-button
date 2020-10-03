'use strict';

const typeHash = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  success: 'btn-success'
};

const scopedStyle = `
  <style>
    .btn {
      margin: 20px;
      width: 130px;
      height: 40px;
      color: #fff;
      padding: 10px 25px;
      font-family: 'Lato', sans-serif;
      font-weight: 500;
      border-radius: 7px;
      outline: none;
    }
    
    .btn[disabled]{
      opacity: 0.5;
    }
    
    .btn-primary {
      background: rgb(9, 20, 172);
    }

    .btn-secondary {
      background: rgb(239 239 239);
      color: black;
    }

    .btn-secondary:hover {
      cursor: pointer;
      background: rgb(175 175 179);
      color: black;
    }

    .btn-primary:hover {
      cursor: pointer;
      background: rgb(0,3,255);
    }

    .btn-danger {
      background: rgb(216 14 14);
    }

    .btn-danger:hover {
      cursor: pointer;
      background: rgb(236 15 15);
    }

    .btn-success  {
      background: rgb(49 148 48);
    }

    .btn-success:hover {
      cursor: pointer;
      background: rgb(46 224 44);
    }
  </style>
`;

(function() {
  class ButtonComponent extends HTMLElement {
    constructor() {
      // establish prototype chain
      super();

      // attaches shadow tree and returns shadow root reference
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow
      const shadow = this.attachShadow({ mode: 'open' });

      this.button = document.createElement('button');

      this.button.classList.add('btn');
      console.log(scopedStyle);
      this.button.innerHTML = `${scopedStyle}<slot></slot>`;
      // appending the button to the shadow DOM
      shadow.appendChild(this.button);
    }

    handleClick(event) {
      this.dispatchEvent(new CustomEvent('zpClick', { composed: true, detail: event }))
    }

    // fires after the element has been attached to the DOM
    connectedCallback() {
      this.button.addEventListener('click', this.handleClick);
      if (this.type) {
        const buttonType = typeHash[this.type] || '';
        if (buttonType) {
          this.button.classList.add(buttonType);
        }
      }
    }

    // fires after the element has been detached from the DOM
    disconnectedCallback() {
      this.button.removeEventListener('click', this.handleClick)
    }


    // Specify which attributes to notice change
    static get observedAttributes() { return ["disabled"]; }

    // fires when anyone property specified in observedAttributes changes
    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue) {
        this.button.setAttribute('disabled', newValue);
        this.button.innerHTML = `${scopedStyle}${this.loadingText}`
      } else {
        this.button.removeAttribute("disabled");
        this.button.innerHTML = `${scopedStyle}<slot></slot>`
      }
    }

    // gathering data from element attributes
    get type() {
      return this.getAttribute('type') || '';
    }
    get disabled() {
      return this.getAttribute('disabled') || false;
    }
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", value);
      } else {
        this.removeAttribute("disabled");
      }
    }
    get loadingText() {
      return this.getAttribute('loadingText') || '';
    }
  }

  // let the browser know about the custom element
  customElements.define('button-component', ButtonComponent);
})();