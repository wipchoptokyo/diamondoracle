window.onload = () => {
  const log = document.getElementById('log');
  if (log) {
    log.textContent = "✅ JSが読み込まれた";
    console.log("✅ Consoleにも出力");
  } else {
    console.error("❌ #log が見つからない");
  }
};
