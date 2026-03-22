let receiverId = null;

// INIT CHAT
function initChat() {
  const params = new URLSearchParams(window.location.search);
  receiverId = params.get("user");

  if (!receiverId) {
    alert("Invalid chat user");
    return;
  }

  loadMessages();
}

// SEND MESSAGE
function sendMessage() {
  const input = document.getElementById("message");
  const text = input.value.trim();
  const user = auth.currentUser;

  if (!text) return;

  db.ref("messages").push({
    sender: user.uid,
    receiver: receiverId,
    text: text,
    time: Date.now()
  });

  input.value = "";
}

// LOAD MESSAGES
function loadMessages() {
  const box = document.getElementById("chatBox");
  const user = auth.currentUser;

  db.ref("messages")
    .orderByChild("time")
    .limitToLast(50)
    .on("value", snapshot => {
      box.innerHTML = "";

      snapshot.forEach(child => {
        const msg = child.val();

        // Only show messages between these two users
        if (
          (msg.sender === user.uid && msg.receiver === receiverId) ||
          (msg.sender === receiverId && msg.receiver === user.uid)
        ) {
          const div = document.createElement("div");
          div.classList.add("message");

          if (msg.sender === user.uid) {
            div.classList.add("sent");
          } else {
            div.classList.add("received");
          }

          div.innerText = msg.text;
          box.appendChild(div);
        }
      });

      // Auto scroll
      box.scrollTop = box.scrollHeight;
    });
}
