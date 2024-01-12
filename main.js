let apiBase= "http://localhost:8080/api/v1/"

$(function () {
    // $("#pagination").load("/assets/html/pagination.html");
    updateRating();
    getListFilm();
});

function updateRating(){
  $.ajax({
    url: apiBase + "film/update-rating",
    type: 'POST',
    //contentType: 'application/json', // Định nghĩa định dạng dữ liệu truyền vào là json
    //data: JSON.stringify(request),
    error: function (err) {
        // Hành động khi api bị lỗi
        console.log(err)
    },
    success: function (data) {
        // Hành động khi thành công
        console.log(data)
    }
});
}

function getListFilm(){
  $.ajax({
    url: apiBase + "film/get-all",
    type: 'GET',
    contentType: 'application/json', // Định nghĩa định dạng dữ liệu truyền vào là json
    // data: JSON.stringify(request),
    error: function (err) {
        // Hành động khi api bị lỗi
        console.log(err)
        alert(err.responseJSON)
    },
    success: function (data) {
        // Hành động khi thành công
        console.log(data)
        fillData(data)
    }
});
}

function fillData(data) {
    console.log(data);
    data.forEach(function(element){
        let text =`<li>
        <div class="movie-card">
          <a href="./movie-details.html">
            <figure class="card-banner">
              <img src="`+ element.image + `" alt="The Northman movie poster">
            </figure>
          </a>
          <div class="title-wrapper">
            <a href="./movie-details.html">
              <h3 class="card-title">`+ element.title + `</h3>
            </a>
            <time datetime="2022">`+ element.year +`</time>
          </div>
          <div class="card-meta">
            <div class="badge badge-outline">HD</div>
            <div class="duration">
              <ion-icon name="time-outline"></ion-icon>
              <time datetime="PT137M">137 min</time>
            </div>
            <div class="rating">
              <ion-icon name="star"></ion-icon>
              <data>`+ element.rating +`</data>
            </div>
          </div>
        </div>
      </li>`
        console.log(element);
        $("#film").append(text)
    })
}
