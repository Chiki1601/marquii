class Marqii {
  constructor({ font, el, content }) {
    this.font = font;
    this.innerEl = document.createElement("div");
    this.setContent(content);

    el.appendChild(this.innerEl);
    this.innerEl.classList.add("marqii__inner");

    this.animate();
    this.fillSpace();
  }

  joinLetters(letters) {
    const stripLeadingWS = str => str.replace(/^\s+/, "");
    const stripTrailingWS = str => str.replace(/\s+$/, "");
    const replaceAllWS = str =>
      str.replace(/\s+/g, match => "_".repeat(match.length));
    const joinRow = (rowA, rowB) =>
      stripTrailingWS(rowA) + stripLeadingWS(rowB);
    const buildWord = (word, letter) => {
      const addLetterToWord = (row, index) => joinRow(row, letter[index]);
      return word.map(addLetterToWord);
    };
    return letters.reduce(buildWord).map(replaceAllWS);
  }

  renderString(letters) {
    return `${letters.join("\n")}`;
  }

  draw() {
    const { renderString, _content, innerEl, el } = this;
    const string = renderString(_content);
    innerEl.innerHTML = string;
  }

  scrollTick(contentArray) {
    const swap = (first, ...rest) => [...rest, first].join("");
    return contentArray.map(row => swap(...row.split("")));
  }

  fillSpace() {
    const { innerEl } = this;
    innerEl.style.overflow = "auto";
    const initialHTML = innerEl.innerHTML;
    while (innerEl.offsetWidth === innerEl.scrollWidth) {
      const { string } = this;
      this.setContent(string + " " + string);
      this.draw();
      if (initialHTML === innerEl.innerHTML || innerEl.offsetWidth === 0) {
        // 'cause I suck and kept locking my browser ayyyy
        console.warn("Attempting to fill caused an infinite loop.");
        break;
      }
    }
    innerEl.style.overflow = "hidden";
  }

  animate(tick = 0) {
    // this can't be the right way to go about this?
    // seemed too fast if it fired every frame tho.
    if (tick % 3 === 0) {
      this._content = this.scrollTick(this._content);
      this.draw();
    }
    requestAnimationFrame(() => this.animate(++tick));
  }

  setContent(string) {
    const { font } = this;
    let letters = string.trim().split("");
    letters = letters.map(letter => font[letter] || font[" "]);
    this.string = string;
    this._content = this.joinLetters(letters);
  }
}

const init = () => {
  const marqii = new Marqii({
    font, // loaded as external resource
    el: document.getElementById("marqii"),
    content: "hello world"
  });

  const updateMarqii = (marqii, content) => {
    marqii.setContent(content);
    marqii.draw();
    marqii.fillSpace();
  };

  marqii.fillSpace();
  window.addEventListener("resize", () => marqii.fillSpace());
  document.getElementById("marqii-input").addEventListener("input", e => {
    updateMarqii(marqii, e.target.value || "_");
  });
};

init();