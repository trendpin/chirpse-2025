function post() {
  const text = document.getElementById("postText").value.trim();
  const file = document.getElementById("photoInput").files[0];
  if (!text && !file) return;

  const postData = { text, uid: me.uid, name: myName, pic: myPic, ts: Date.now() };

  if (file) {
    const ref = storage.ref("posts/" + Date.now() + "_" + file.name);
    ref.put(file).then(snap => snap.ref.getDownloadURL())
      .then(url => { postData.photo = url; savePost(postData); });
  } else {
    savePost(postData);
  }
}

function savePost(data) {
  db.collection("posts").add(data).then(() => {
    document.getElementById("postText").value = "";
    document.getElementById("photoInput").value = "";
    loadFeed();
  });
}

function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "<p>Loading...</p>";
  db.collection("posts").orderBy("ts", "desc").onSnapshot(snap => {
    feed.innerHTML = "";
    snap.forEach(doc => {
      const p = doc.data();
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `<strong>${p.name}</strong><br>${p.text || ""}${p.photo ? `<img src="${p.photo}">` : ""}<br><small>${new Date(p.ts).toLocaleString()}</small>`;
      feed.appendChild(div);
    });
  });
}
