"use strict";

let title = "";
let year = 0;
let rating = 0;
let genre = null;
let isManagerFilm = true;
let token = "";
let size = 8;
let pageNumber = 1;
let sortField = "id";
let sortType = "ASC";

let apiBase = "http://localhost:8080/api/v1/film/";

$(function () {
  buildManager();
  getListFilm();
});

function buildManager() {
  if (
    "USER" === localStorage.getItem("role") ||
    localStorage.getItem("role") === null
  ) {
    isManagerFilm = false;
  } else {
    isManagerFilm = true;
    $("#button-add").empty()
      .append(`<button class="btn btn-primary" style="color: aliceblue;" onclick="addFilm()"><ion-icon name="add-outline"></ion-icon>
    Add Film</button>`);
  }
}

function FilmSearchRequest(
  title,
  year,
  rating,
  genre,
  size,
  pageNumber,
  sortField,
  sortType
) {
  this.title = title;
  this.year = year;
  this.rating = rating;
  this.genre = genre;
  this.size = size;
  this.page = pageNumber;
  this.sortField = sortField;
  this.sortType = sortType;
}

function FilmCreateRequest(id, title, image, year, description, genre) {
  this.id = id;
  this.title = title;
  this.image = image;
  this.year = year;
  this.description = description;
  this.genre = genre;
}

function getListFilm() {
  let request = new FilmSearchRequest(
    title,
    year,
    rating,
    genre,
    size,
    pageNumber,
    sortField,
    sortType
  );
  $.ajax({
    url: apiBase + "search",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    contentType: "application/json", // Định nghĩa định dạng dữ liệu truyền vào là json
    data: JSON.stringify(request),
    error: function (err) {
      // Hành động khi api bị lỗi
      console.log(err);
      confirm(err.responseJSON.message);
    },
    success: function (data) {
      // Hành động khi thành công
      fillData(data.content);
      buildPagination(data.number + 1, data.totalPages);
    },
  });
}

function buildPagination(number, totalPages) {
  // kiểm tra nếu trang hiện tại là trang đầu -> disable đi
  if (number === 1) {
    $("#pagination").empty().append(`<li class="pagination-item">
                              <a class="pagination-item__link">
                              <ion-icon name="chevron-back-outline"></ion-icon>
                              </a></li>`);
  } else {
    $("#pagination").empty().append(`<li class="pagination-item">
                              <a href="#" class="pagination-item__link " onclick="prePage()">
                              <ion-icon name="chevron-back-outline"></ion-icon>
                              </a></li>`);
  }

  // Dùng hàm for để build ra số trang. Kiểm tra xem trang hiện tại là bao nhiêu thì background vàng
  for (let index = 1; index <= totalPages; index++) {
    if (number === index) {
      $("#pagination").append(
        `<li class="pagination-item pagination-item--active">
                                <a href="" class="pagination-item__link" onclick="chosePage(` +
          index +
          `)">` +
          index +
          `</a>
                              </li>`
      );
    } else {
      $("#pagination").append(
        `<li class="pagination-item">
                                <a href="" class="pagination-item__link" onclick="chosePage(` +
          index +
          `)">` +
          index +
          `</a>
                              </li>`
      );
    }
  }

  // Kiểm tra nếu trang hiện tại là trang cuối -> disable đi
  if (number === totalPages) {
    $("#pagination").append(`<li class="pagination-item">
                              <a class="pagination-item__link "">
                              <ion-icon name="chevron-forward-outline"></ion-icon>
                              </a></li>`);
  } else {
    $("#pagination").append(`<li class="pagination-item">
                              <a href="#" class="pagination-item__link " onclick="nextPage()">
                              <ion-icon name="chevron-forward-outline"></ion-icon>
                              </a></li>`);
  }
}

function chosePage(page) {
  event.preventDefault();
  pageNumber = page;
  getListFilm();
}
function prePage() {
  event.preventDefault();
  pageNumber--;
  getListFilm();
}

function nextPage() {
  event.preventDefault();
  pageNumber++;
  getListFilm();
}

function fillData(data) {
  $("#film").empty();

  data.forEach(function (element) {
    let text =
      `<li>
        <div class="movie-card">
            <figure class="card-banner">
              <img src="` +
      element.image +
      `" alt="The Northman movie poster">
            </figure>
          </a>
          <div class="title-wrapper">
            <a href="#" onclick="navToFilmDetail(` +
      element.id +
      `)">
              <h3 class="card-title">` +
      element.title +
      `</h3>
            </a>
            <time datetime="2022">` +
      element.year +
      `</time>
          </div>
          <div class="card-meta">
            <div class="badge badge-outline">HD</div>
            <div class="duration">
              <ion-icon name="time-outline"></ion-icon>
              <time datetime="PT137M">137 min</time>
            </div>
            <div class="rating">
              <ion-icon name="star"></ion-icon>
              <data>` +
      element.rating +
      `</data>
            </div>
          </div>
          ${
            isManagerFilm
              ? `<br>
            <div class="card-meta"> 
              <button class="btn btn-primary" style="color: aliceblue;" onclick="editFilm('${element.id}', '${element.title}', '${element.image}', '${element.year}', '${element.description}', '${element.genre}')">Update</button>
              <button class="btn btn-primary" style="color: aliceblue;" onclick="confirmDeleteFilm('${element.id}')">Delete</button>
            </div>`
              : ``
          }
        </div>
      </li>`;
    $("#film").append(text);
  });
}

function genreFilter(filmGenre) {
  genre = filmGenre;
  getListFilm();
}

function sortByTitle(sort) {
  sortField = "title";
  sortType = sort;
  getListFilm();
}

function sortByRating(sort) {
  sortField = "rating";
  sortType = sort;
  getListFilm();
}

function sortByYear(sort) {
  sortField = "year";
  sortType = sort;
  getListFilm();
}

function filmTittleSearch() {
  title = document.getElementById("film_title_search").value;
  getListFilm();
}

// Get the input field
var input = document.getElementById("film_title_search");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search_btn").click();
  }
});

function hideModal(){
  document.getElementById('myModal').style.display='none';
  clearFilmModal();
}

function editFilm(
  filmId,
  filmTittle,
  filmImage,
  filmYear,
  filmDesciption,
  filmGenre
) {
  document.getElementById("id").value = filmId;
  document.getElementById("title").value = filmTittle;
  document.getElementById("image").value = filmImage;
  document.getElementById("year").value = filmYear;
  document.getElementById("description").value = filmDesciption;
  document.getElementById("genre").value = filmGenre;
  document.getElementById("myModal").style.display = "block";
}

function addFilm() {
  document.getElementById("myModal").style.display = "block";
}

function confirmDeleteFilm(filmId) {
  document.getElementById("modalConfirmDelete").style.display = "block";
  document.getElementById("filmIdDelete").value = filmId;
}

function deleteFilm() {
  let filmId = document.getElementById("filmIdDelete").value;
  //   ------------------------------------- API XOÁ SẢN PHẨM -------------------------------------
  $.ajax({
    url: apiBase + filmId,
    type: "DELETE",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    contentType: "application/json",
    error: function (err) {
      console.log(err);
      confirm(err.responseJSON.message);
    },
    success: function (data) {
      document.getElementById("modalConfirmDelete").style.display = "none";
      getListFilm();
    },
  });
}

function clearFilmModal() {
  document.getElementById("id").value = "";
  document.getElementById("title").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("image").value = "";
  document.getElementById("year").value = "";
  document.getElementById("description").value = "";
}

function saveFilm() {
  const filmId = document.getElementById("id").value;
  const filmTittle = document.getElementById("title").value;
  const filmGenre = document.getElementById("genre").value;
  const filmImage = document.getElementById("image").value;
  const filmYear = document.getElementById("year").value;
  const filmDesciption = document.getElementById("description").value;


  // Tạo 1 request
  let request = new FilmCreateRequest(
    filmId,
    filmTittle,
    filmImage,
    filmYear,
    filmDesciption,
    filmGenre
  );
  let url = filmId === "" ? apiBase + "create" : apiBase + "update";
  let type = filmId === "" ? "POST" : "PUT";

  //   ------------------------------------- API UPDATE, THÊM MỚI SẢN PHẨM -------------------------------------
  $.ajax({
    url: url,
    type: type,
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    contentType: "application/json",
    data: JSON.stringify(request),
    error: function (err) {
      console.log(err);
      confirm(err.responseJSON.message);
    },
    success: function (data) {
      document.getElementById("myModal").style.display = "none";
      getListFilm();
      clearFilmModal();
    },
  });
}




// ------------------------ FILM DETAILS -----------------------


function navToFilmDetail(film){
  $("#body-filmrating").load("film-details.html");
  filmDetail(film); 
  filmReviewList(film);
}
function filmDetail(filmId) {
  $.ajax({
    url: "http://localhost:8080/api/v1/film/get-by-id?id=" + filmId,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    contentType: "application/json",
    error: function (err) {
      console.log(err);
      confirm(err.responseJSON.message);
    },
    success: function (data) {
      fillDetailFilm(data);
      ratingFilm(data);
      getRelatedFilm(data);
      getRelatedFilm(data);
    },
  });
}
function ratingFilm(film) {
  $("#rating-here").empty();
  if(localStorage.getItem("token") === null){
    $("#rating-here").append(`<div class="testimonial-heading">
    <span>Reviews</span>
    <h1>Write Your Review Here</h1>
  </div>
  <!--testimonials-box-container------>
  <div class="testimonial-box-container" >
  <div class="testimonial-box">
    <div class="container">
    
        <div class="row">
          <div class="col-25">
            <label for="rating">Rating</label>
          </div>
          <div class="col-75">
            <input
              type="number"
              id="rating"
              name="rating"
              placeholder="Enter your rating..."
            />
          </div>
        </div>
        <div class="row">
          <div class="col-25">
            <label for="review">Review</label>
          </div>
          <div class="col-75">
            <textarea
              id="subject"
              name="subject"
              placeholder="Write something.."
              style="height: 200px"
            ></textarea>
          </div>
        </div>
        <br />
        <div class="row" onclick="loginAlert()">
          <input type="submit" value="Submit"/>
        </div>

    </div>
  </div>
  </div>
  `)
   } else {
    if ("ADMIN" === localStorage.getItem("role")) {
      $("#rating-here").append(``)
   } else {
    $("#rating-here").append(`<div class="testimonial-heading">
    <span>Reviews</span>
    <h1>Write Your Review Here</h1>
  </div>
  <!--testimonials-box-container------>
  <div class="testimonial-box-container" >
  <div class="testimonial-box">
    <!--top------------------------->
    <div class="box-top">
      <!--profile----->
      <div class="profile">
        <!--img---->
        <div class="profile-img">
          <img src="`+localStorage.avatar+`" />
        </div>
        <!--name-and-username-->
        <div class="name-user">
          <strong>`+localStorage.fullName+`</strong>
          <span>@`+localStorage.username+`</span>
        </div>
      </div>
      <!--reviews------>
      <div class="reviews">
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon>
        <ion-icon name="star-outline"></ion-icon
        ><!--Empty star-->
      </div>
    </div>
    <div class="container">
      <input type="hidden" id="review-id" name="id">
        <div class="row">
          <div class="col-25">
            <label>Rating</label>
          </div>
          <div class="col-75">
            <input
              type="number"
              id="review-rating"
              placeholder="Enter your rating..."
            />
          </div>
        </div>
        <div class="row">
          <div class="col-25">
            <label>Review</label>
          </div>
          <div class="col-75">
            <textarea
              id="review-content"
              placeholder="Write something.."
              style="height: 200px"
            ></textarea>
          </div>
        </div>
        <br />
        <div class="row" onclick="saveReview(`+film.id+`)">
          <input type="submit" value="Submit" />
        </div>
    </div>
  </div>
  </div>`)
   }
  }
   
}

function fillDetailFilm(film){
  $("#film-detail").empty()
    $("#film-detail").append(`<figure class="movie-detail-banner">
    <img
      src="`+film.image+`"
      alt="Free guy movie poster"
    />

    <button class="play-btn">
      <ion-icon name="play-circle-outline"></ion-icon>
    </button>
  </figure>

  <div class="movie-detail-content">
    <p class="detail-subtitle">New Episodes</p>

    <h1 class="h1 detail-title">`+film.title+`</h1>

    <div class="meta-wrapper">
      <div class="badge-wrapper">
        <div class="badge badge-fill">PG 13</div>

        <div class="badge badge-outline">HD</div>
      </div>

      <div class="ganre-wrapper">
        <a href="#">`+film.genre+`</a>
      </div>

      <div class="date-time">
        <div>
          <ion-icon name="calendar-outline"></ion-icon>

          <time datetime="2021">`+film.year+`</time>
        </div>

        <div>
        <ion-icon name="star-outline"></ion-icon>

          <time datetime="PT115M">`+film.rating+`</time>
        </div>
      </div>
    </div>

    <p class="storyline">
    `+film.description+`
    </p>

    <div class="details-actions">
      <button class="share">
        <ion-icon name="share-social"></ion-icon>

        <span>Share</span>
      </button>

      <div class="title-wrapper">
        <p class="title">Prime Video</p>

        <p class="text">Streaming Channels</p>
      </div>

      <button class="btn btn-primary">
        <ion-icon name="play"></ion-icon>

        <span>Watch Now</span>
      </button>
    </div>

    <a
      href="./assets/images/movie-4.png"
      download
      class="download-btn"
    >
      <span>Download</span>

      <ion-icon name="download-outline"></ion-icon>
    </a>
  </div>`)
}
function filmReviewList(filmId){
  $.ajax({
    url: "http://localhost:8080/api/v1/review/find-by-film?filmId=" + filmId,
    type: "GET",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    contentType: "application/json",
    error: function (err) {
      console.log(err);
      confirm(err.responseJSON.message);
    },
    success: function (data) {
      fillReviewList(data);
    },
  });
}
function fillReviewList(film){
  $("#user-review").empty();
  console.log(film)
  film.forEach(function (element) {
    let text =
      `<div class="testimonial-box">
      <!--top------------------------->
      <div class="box-top">
        <!--profile----->
        <div class="profile">
          <!--img---->
          <div class="profile-img">
            <img src="`+element.account.avatar+`" />
          </div>
          <!--name-and-username-->
          <div class="name-user">
            <strong>`+element.account.fullName+`</strong>
            <span>@`+element.account.username+`</span>
          </div>
        </div>
        <!--reviews------>
        <div class="reviews">
          <strong>`+element.rating+`</strong>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon>
          <ion-icon name="star-outline"></ion-icon
          ><!--Empty star-->
        </div>
      </div>
      <!--Comments---------------------------------------->
      <div class="client-comment">
        <p>
        `+element.content+`
        </p>
      </div>
    </div>`;
    $("#user-review").append(text);
  });
}
function loginAlert(){
  document.getElementById("loginAlert").style.display = "block";
}

function navToLogin(){
  window.location.href = "./login.html"
}
function getRelatedFilm(film) {
  let request = new FilmSearchRequest(
    "",
    year,
    rating,
    film.genre,
    4,
    1,
    sortField,
    sortType
  );
  $.ajax({
    url: apiBase + "search",
    type: "POST",
    beforeSend: function (xhr) {
      xhr.setRequestHeader(
        "Authorization",
        "Bearer " + localStorage.getItem("token")
      );
    },
    contentType: "application/json", // Định nghĩa định dạng dữ liệu truyền vào là json
    data: JSON.stringify(request),
    error: function (err) {
      // Hành động khi api bị lỗi
      console.log(err);
      confirm(err.responseJSON.message);
    },
    success: function (data) {
      // Hành động khi thành công
      fillRelatedFilm(data.content);
    },
  });
}
function fillRelatedFilm(film){
  $("#related-film").empty()
  film.forEach(function (element) {
    let text =
      `<li>
      <div class="movie-card">
          <figure class="card-banner">
            <img
              src="`+element.image+`"
              alt="Moon Knight movie poster"
            />
          </figure>
        </a>
    
        <div class="title-wrapper">
          <a href="#" onclick="navToFilmDetail(` +
          element.id +
          `)">
            <h3 class="card-title">`+element.title+`</h3>
          </a>
    
          <time datetime="2022">`+element.year+`</time>
        </div>
    
        <div class="card-meta">
          <div class="badge badge-outline">2K</div>
    
          <div class="duration">
            <ion-icon name="time-outline"></ion-icon>
    
            <time datetime="PT47M">47 min</time>
          </div>
    
          <div class="rating">
            <ion-icon name="star"></ion-icon>
    
            <data>`+element.rating+`</data>
          </div>
        </div>
      </div>
    </li>`;
    $("#related-film").append(text);
  });
}

