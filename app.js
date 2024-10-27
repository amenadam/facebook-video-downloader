require("dotenv").config();
const express = require("express");
const request = require("request");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public")); // Serve static files from the frontend directory

const getUrl = (url) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      url: "https://www.getfvid.com/downloader",
      formData: { url: url },
    };

    request(options, function (error, response) {
      if (error) {
        console.error("Error fetching video:", error); // Log the error to the console
        reject("Error fetching video: " + error);
        return;
      }

      const rgx =
        /<a href="(.+?)" target="_blank" class="btn btn-download"(.+?)>(.+?)<\/a>/g;
      let arr = [...response.body.matchAll(rgx)];
      if (arr.length > 0) {
        resolve({ videoName: "video.mp4", downloadUrl: arr[0][1] });
      } else {
        console.error("No download link found in response body"); // Log if no link is found
        reject("No download link found.");
      }
    });
  });
};

app.get("/api/proxy-download", (req, res) => {
  const downloadUrl = req.query.url;
  console.log("Proxy download URL:", downloadUrl); // Log the download URL

  request(downloadUrl)
    .on("error", (err) => {
      console.error("Download error:", err);
      res.status(500).send("Error downloading file");
    })
    .pipe(res);
});


app.post("/api/download", (req, res) => {
  const url = req.body.url;
  getUrl(url)
    .then(({ videoName, downloadUrl }) => {
      // Ensure downloadUrl is valid and directly accessible
      res.json({ videoName, downloadUrl });
    })
    .catch((error) => {
      console.error("Error in API route:", error);
      res.status(500).json({ error });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
