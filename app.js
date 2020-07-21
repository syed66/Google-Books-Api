const form = document.getElementById("form");
const search = document.getElementById("search");
const results = document.getElementById("results");
const next = document.getElementById("next");
const prev = document.getElementById("prev");
const maxResults = 8;
let startIndex = 0;

// asynchronous function to retrrieve data from api
async function getBooks() {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${search.value}&startIndex=${startIndex}&maxResults=${maxResults}`
  );
  const books = await response.json();
  // check for error
  if (books.totalItems === 0) {
    next.style.display = "none";
    showError("Book Not Found");
    setTimeout(() => {
      document.querySelector(".error").remove();
    }, 5000);
  } else {
    showBooks(books);
  }
}

// shows error
function showError(message) {
  if (message) {
    clearDisplay();
    const error = document.createElement("div");
    error.className = "error";
    error.innerHTML = message;
    results.appendChild(error);
  }
}
// ui to display books on page
function showBooks(books) {
  const ul = document.createElement("ul");
  ul.className = "booklist";
  let output = "";
  // looping through each book
  books.items.forEach((book) => {
    const title = book.volumeInfo.title;
    const link = book.volumeInfo.previewLink;
    const description = book.volumeInfo.description;
    let thumbnail;
    let authors;
    console.log(book);

    if (!("authors" in book.volumeInfo)) {
      authors = "N/A";
    } else {
      authors = book.volumeInfo.authors;
    }

    if (!("imageLinks" in book.volumeInfo)) {
      thumbnail = "N/A";
    } else {
      thumbnail = book.volumeInfo.imageLinks.thumbnail;
    }
    output += `
    <li class='bookItem'>
        <img src=${thumbnail}>
        <p class ='title'>${title} <span class='author-text'>By ${authors}</span></p> 
        
        <a href=${link} target = '_blank' class="btn preview">Check it out</a>
    </li>
    `;
    ul.innerHTML = output;
    results.appendChild(ul);
  });
  // displays buttons
  if (startIndex < maxResults) {
    prev.style.display = "none";
  } else {
    prev.style.display = "block";
  }

  if (books.items.length < 8) {
    next.style.display = "none";
  } else {
    next.style.display = "block";
  }
}

// clears display to avoid repetition
function clearDisplay() {
  results.innerHTML = "";
}

// event listeners
form.addEventListener("submit", (e) => {
  startIndex = 0;
  clearDisplay();
  if (search.value === "") {
    alert("enter valid title");
    return false;
  } else {
    getBooks();
  }
  e.preventDefault();
});

// click events for pagination
next.addEventListener("click", (e) => {
  clearDisplay();
  startIndex += maxResults;
  getBooks();
  e.preventDefault();
});
prev.addEventListener("click", (e) => {
  clearDisplay();
  startIndex -= maxResults;
  getBooks();
  e.preventDefault();
});
