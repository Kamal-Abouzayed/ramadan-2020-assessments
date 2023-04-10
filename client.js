document.addEventListener("DOMContentLoaded", function () {
  const videoList = document.getElementById("listOfRequests");

  const videoForm = document.getElementById("videoReqForm");

  // submit video request
  videoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(videoForm);

    // console.log(data);

    fetch("http://localhost:7777/video-request", { method: "POST", body: data })
      .then((jsonData) => jsonData.json())
      .then((video) => {
        videoList.prepend(appendToList(video));
      });
  });

  // display data in video request list
  fetch("http://localhost:7777/video-request")
    .then((videos) => videos.json())
    .then((list) => {
      list.forEach((video) => {
        videoList.appendChild(appendToList(video));

        const voteUpsElm = document.getElementById(`votes_ups_${video._id}`);
        const voteDownsElm = document.getElementById(
          `votes_downs_${video._id}`
        );
        const voteScoreElm = document.getElementById(`score_vote_${video._id}`);

        voteUpsElm.addEventListener("click", function (e) {
          e.preventDefault();

          fetch("http://localhost:7777/video-request/vote", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: video._id, vote_type: "ups" }),
          })
            .then((bolb) => bolb.json())
            .then((data) => (voteScoreElm.innerHTML = data.ups - data.downs));
        });

        voteDownsElm.addEventListener("click", function (e) {
          e.preventDefault();

          fetch("http://localhost:7777/video-request/vote", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: video._id, vote_type: "downs" }),
          })
            .then((bolb) => bolb.json())
            .then((data) => (voteScoreElm.innerHTML = data.ups - data.downs));
        });
      });
    });

  // append to list function
  function appendToList(video) {
    const div = document.createElement("div");

    div.innerHTML = `<div class="card mb-3">
            <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
                <h3>${video.topic_title}</h3>
                <p class="text-muted mb-2">${video.topic_details}</p>
                <p class="mb-0 text-muted">
                ${
                  video.expected_result
                    ? `<strong>Expected results:</strong> ${video.expected_result}`
                    : ""
                }
                </p>
            </div>
            <div class="d-flex flex-column text-center">
                <a id="votes_ups_${video._id}" class="btn btn-link">🔺</a>
                <h3 id="score_vote_${video._id}">${
      video.votes.ups - video.votes.downs
    }</h3>
                <a id="votes_downs_${video._id}" class="btn btn-link">🔻</a>
            </div>
            </div>
            <div class="card-footer d-flex flex-row justify-content-between">
            <div>
                <span class="text-info">NEW</span>
                &bullet; added by <strong>${video.author_name}</strong> on
                <strong>${new Date(video.submit_date).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}</strong>
            </div>
            <div
                class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
                <div class="badge badge-success">
                ${video.target_level}
                </div>
            </div>
            </div>
        </div>`;

    return div;
  }
});
