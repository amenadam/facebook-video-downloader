require("dotenv").config();
const express = require("express");
const request = require("request");
const app = express();

app.use(express.json());

const getUrl = (url) => {
  return new Promise((resolve, reject) => {
    let options = {
      method: "POST",
      url: "https://www.getfvid.com/downloader",
      formData: { url: url },
    };

    request(options, function (error, response) {
      if (error) {
        console.error("Error fetching video:", error);
        reject("Error fetching video: " + error);
        return;
      }

      const rgx = /<a href="(.+?)" target="_blank" class="btn btn-download"(.+?)>(.+?)<\/a>/g;
      let arr = [...response.body.matchAll(rgx)];
      if (arr.length > 0) {
        console.log("Download link found:", arr[0][1]); // Log the download link
        resolve({ videoName: "video.mp4", downloadUrl: arr[0][1] });
      } else {
        reject("No download link found.");
      }
    });
  });
};



    request(options, function (error, response) {
      if (error) {
        console.error("Error fetching video:", error);
        reject("Error fetching video: " + error);
        return;
      }

      const rgx = /<a href="(.+?)" target="_blank" class="btn btn-download"(.+?)>(.+?)<\/a>/g;
      let arr = [...response.body.matchAll(rgx)];
      if (arr.length > 0) {
        console.log("Download link found:", arr[0][1]); // Log the download link
        resolve({ videoName: "video.mp4", downloadUrl: arr[0][1] });
      } else {
        reject("No download link found.");
      }
    });
  });
};


    request(options, function (error, response) {
      if (error) {
        console.error("Error fetching video:", error);
        reject("Error fetching video: " + error);
        return;
      }

      const rgx =
        /<a href="(.+?)" target="_blank" class="btn btn-download"(.+?)>(.+?)<\/a>/g;
      let arr = [...response.body.matchAll(rgx)];
      if (arr.length > 0) {
        resolve({ videoName: "video.mp4", downloadUrl: arr[0][1] });
      } else {
        reject("No download link found.");
      }
    });
  });
};

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const url = req.body.url;
    try {
      const { videoName, downloadUrl } = await getUrl(url);
      res.json({ videoName, downloadUrl });
    } catch (error) {
      console.error("Error in API route:", error);
      res.status(500).json({ error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

