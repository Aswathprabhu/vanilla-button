'use strict';

const typeHash = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  success: 'btn-success',
  warning: 'btn-warning',
  info: 'btn-info'
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
      border: none;
      transition: transform 0.3s ease-in-out;
    }
    .btn:hover {
      box-shadow: 0 3px 10px 0 #aaa;
      transform: translateY(-3px);
    }
    
    .btn[disabled]{
      opacity: 0.5;
    }
    
    .btn-primary {
      background: #0914ac;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      cursor: pointer;
      background: #afafb3;
      color: black;
    }

    .btn-primary:hover {
      cursor: pointer;
      background: #0003ff;
    }

    .btn-danger {
      background: #dc3545;
    }

    .btn-danger:hover {
      cursor: pointer;
      background: #ff3737;
    }

    .btn-success  {
      background: #329430;
    }

    .btn-success:hover {
      cursor: pointer;
      background: #2ee02c;
    }

    .btn-warning {
      background: #e0a31a;
    }

    .btn-warning:hover {
      cursor: pointer;
      background: #ffae00;
    }

    .btn-info {
      background: #17a2b8;
    }

    .btn-info:hover {
      cursor: pointer;
      background: #00e7ff;
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