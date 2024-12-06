const canvas = document.getElementById("canvas");
const addTextBtn = document.getElementById("addTextBtn");
const increaseFontBtn = document.getElementById("increaseFontBtn");
const decreaseFontBtn = document.getElementById("decreaseFontBtn");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const textPopup = document.getElementById("textPopup");
const textInput = document.getElementById("textInput");
const addTextToCanvasBtn = document.getElementById("addTextToCanvasBtn");
const fontSize = document.getElementById("fontSize");

let selectedText = null;
let undoStack = [];
let redoStack = [];

fontSize.innerHTML = "0";

function saveState() {
  undoStack.push(canvas.innerHTML);
  redoStack = [];
}

function restoreState(state) {
  canvas.innerHTML = state;
  canvas.querySelectorAll(".text-item").forEach((textElement) => {
    textElement.addEventListener("mousedown", enableDrag);
    textElement.ondragstart = () => false;
  });
}

function updateFontSizeDisplay() {
  if (selectedText) {
    const currentSize = parseInt(
      window.getComputedStyle(selectedText).fontSize
    );
    fontSize.innerHTML = currentSize;
  } else {
    fontSize.innerHTML = "0";
  }
}

function enableDrag(e) {
  selectedText = e.target;
  updateFontSizeDisplay();
  selectedText.style.cursor = "grabbing";

  const shiftX = e.clientX - selectedText.getBoundingClientRect().left;
  const shiftY = e.clientY - selectedText.getBoundingClientRect().top;

  const moveAt = (pageX, pageY) => {
    selectedText.style.left = `${pageX - shiftX}px`;
    selectedText.style.top = `${pageY - shiftY}px`;
  };

  const onMouseMove = (event) => moveAt(event.pageX, event.pageY);

  document.addEventListener("mousemove", onMouseMove);

  document.onmouseup = () => {
    document.removeEventListener("mousemove", onMouseMove);
    selectedText.style.cursor = "grab";
    document.onmouseup = null;
    saveState();
  };
}

addTextBtn.addEventListener("click", () => {
  textPopup.classList.remove("hidden");
});

addTextToCanvasBtn.addEventListener("click", () => {
  const text = textInput.value.trim();
  if (text) {
    const textElement = document.createElement("div");
    textElement.className = "text-item";
    textElement.contentEditable = true;
    textElement.innerText = text;
    textElement.style.left = "10px";
    textElement.style.top = "10px";
    textElement.style.fontSize = "16px";
    canvas.appendChild(textElement);

    textPopup.classList.add("hidden");
    textInput.value = "";

    textElement.addEventListener("mousedown", enableDrag);
    textElement.ondragstart = () => false;

    saveState();
    selectedText = textElement;
    updateFontSizeDisplay();
  }
});

increaseFontBtn.addEventListener("click", () => {
  if (selectedText) {
    const currentSize = parseInt(
      window.getComputedStyle(selectedText).fontSize
    );
    selectedText.style.fontSize = `${currentSize + 1}px`;
    updateFontSizeDisplay();
    saveState();
  }
});

decreaseFontBtn.addEventListener("click", () => {
  if (selectedText) {
    const currentSize = parseInt(
      window.getComputedStyle(selectedText).fontSize
    );
    selectedText.style.fontSize = `${Math.max(10, currentSize - 1)}px`;
    updateFontSizeDisplay();
    saveState();
  }
});

boldBtn.addEventListener("click", () => {
  if (selectedText) {
    const fontWeight = window.getComputedStyle(selectedText).fontWeight;
    selectedText.style.fontWeight = fontWeight === "700" ? "400" : "700";
    saveState();
  }
});

italicBtn.addEventListener("click", () => {
  if (selectedText) {
    const fontStyle = window.getComputedStyle(selectedText).fontStyle;
    selectedText.style.fontStyle = fontStyle === "italic" ? "normal" : "italic";
    saveState();
  }
});

undoBtn.addEventListener("click", () => {
  if (undoStack.length > 0) {
    redoStack.push(canvas.innerHTML);
    restoreState(undoStack.pop());
  }
});

redoBtn.addEventListener("click", () => {
  if (redoStack.length > 0) {
    undoStack.push(canvas.innerHTML);
    restoreState(redoStack.pop());
  }
});
