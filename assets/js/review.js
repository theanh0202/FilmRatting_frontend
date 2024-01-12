
let apiBaseReview = "http://localhost:8080/api/v1/review/";

function ReviewCreateRequest(content, rating, account, film) {
    this.content = content;
    this.rating = rating;
    this.accountId = account;
    this.filmId = film;
  }

function saveReview(filmId){
    let content = document.getElementById("review-content").value;
    let rating = document.getElementById("review-rating").value;
    let accountId = localStorage.getItem("id");

    let request = new ReviewCreateRequest(content, rating, accountId, filmId);
    $.ajax({
      url: apiBaseReview + "create",
      type: "POST",
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"))
      },
      contentType: "application/json",
      data: JSON.stringify(request),
      error: function (err) {
        console.log(err);
        confirm(err.responseJSON.message);
      },
      success: function (data) {
        navToFilmDetail(data.film.id);
      },
    });
}

function navToReviewHistory(){
  $("#body-filmrating").load("review-history.html");
  getReviewHistory();
}

function getReviewHistory(){
  $.ajax({
    url: "http://localhost:8080/api/v1/review/find-by-account?accountId=" + localStorage.id,
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
      fillReviewHistory(data);      
    },
  });
}

function fillReviewHistory(data){
  $("#review-history").empty();
  data.forEach(function (element) {
    let text =
      `<div class="container">
      <figure class="movie-detail-banner">
          <img
            src="`+element.film.image+`"
            alt="Free guy movie poster"
          />
      
          <button class="play-btn">
            <ion-icon name="play-circle-outline"></ion-icon>
          </button>
        </figure>
      
        <div class="movie-detail-content">
          <h1 class="detail-subtitle">`+element.film.title+`</h1>
      
          <div class="meta-wrapper">
            <div class="badge-wrapper">
              <div class="badge badge-fill">PG 13</div>
      
              <div class="badge badge-outline">HD</div>
            </div>
      
            <div class="ganre-wrapper">
              <a href="#">`+element.film.genre+`</a>
            </div>
      
            <div class="date-time">
              <div>
                <ion-icon name="calendar-outline"></ion-icon>
      
                <time datetime="2021">`+element.film.year+`</time>
              </div>
      
              <div>
              <ion-icon name="star-outline"></ion-icon>
      
                <time datetime="PT115M">`+element.film.rating+`</time>
              </div>
            </div>
          </div>
          <p class="navbar-link">Your Review</p>
          <p class="storyline">
          `+element.content+`
          </p>
      
          <div class="details-actions">
      
            <div class="title-wrapper">
              <p class="title">Your Rating</p>
              <strong class="reviews">`+element.rating+`</strong>
            </div>
      
            
          </div>
      
        </div>
        <button class="btn btn-primary" onclick="confirmDeleteReview(`+element.id+`)">Delete</button>
        <button class="btn btn-primary"onclick="editReview('${element.id}', '${element.content}', '${element.rating}')">Update</button>
  </div>`;
    $("#review-history").append(text);
  });
}

function confirmDeleteReview(reviewId) {
  document.getElementById("modalDeleteReview").style.display = "block";
  document.getElementById("reviewIdDelete").value = reviewId;
}

function deleteReview() {
  let reviewId = document.getElementById("reviewIdDelete").value;
  //   ------------------------------------- API XOÁ SẢN PHẨM -------------------------------------
  $.ajax({
    url: apiBaseReview + reviewId,
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
      document.getElementById("modalDeleteReview").style.display = "none";
      navToReviewHistory();
    },
  });
}

function editReview(id, content, rating) {
  document.getElementById("reviewIdUpdate").value = id;
  document.getElementById("subject-update").value = content;
  document.getElementById("rating-update").value = rating;
  document.getElementById("modalEditReview").style.display = "block";
}
function ReviewUpdateRequest(id, content, rating){
  this.id = id;
  this.content = content;
  this.rating = rating;
}
function updateReview(){
  let id = document.getElementById("reviewIdUpdate").value;
  let content = document.getElementById("subject-update").value;
  let rating = document.getElementById("rating-update").value;

  let request = new ReviewUpdateRequest(id, content, rating);
  $.ajax({
    url: apiBaseReview + "update",
    type: "PUT",
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"))
    },
    contentType: "application/json",
    data: JSON.stringify(request),
    error: function (err) {
      console.log(err);
      confirm(err.responseJSON.message);

    },
    success: function (data) {
      document.getElementById("modalEditReview").style.display = "none";
      getReviewHistory(data); 
    },
  });
}