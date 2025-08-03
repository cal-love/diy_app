
document.getElementById('dadoHeight').oninput = function () {
  document.getElementById('dadoValue').textContent = this.value;
};

function calculate() {
  const wall = parseFloat(document.getElementById('wallLength').value);
  const ceiling = parseFloat(document.getElementById('ceilingHeight').value);
  const dado = parseFloat(document.getElementById('dadoHeight').value);
  const stile = parseFloat(document.getElementById('stileWidth').value);
  const margin = parseFloat(document.getElementById('margin').value);
  const approxWidth = parseFloat(document.getElementById('approxPanelWidth').value);
  const endStile = document.getElementById('endStile').value === "yes";
  const style = document.getElementById('style').value;

  const minPanelWidth = 200;
  const totalStiles = endStile ? 1 : 0;
  let panelCount = Math.max(1, Math.round((wall + stile) / (approxWidth + stile)));
  let panelWidth = (wall + stile - (panelCount + totalStiles) * stile) / panelCount;

  if (panelWidth < minPanelWidth) {
    document.getElementById('output').innerHTML = "⚠️ Panel width too narrow. Increase wall length or decrease panel count.";
    return;
  }

  const positions = [];
  for (let i = 0; i <= panelCount; i++) {
    const x = i * (panelWidth + stile);
    if (i === panelCount && !endStile) continue;
    positions.push(x.toFixed(0));
  }

  let output = `
    <strong>Results:</strong><br/>
    • Panel count: ${panelCount}<br/>
    • Panel width: ${panelWidth.toFixed(0)} mm<br/>
    • Stile positions: ${positions.join(" mm, ")} mm<br/>
    • Style: ${style}<br/>
  `;
  if (style.includes("dado")) {
    output += `• Dado rail at: ${dado} mm height<br/>`;
  }

  document.getElementById('output').innerHTML = output;

  // Drawing
  const canvas = document.getElementById('layout');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const scale = canvas.width / wall;

  // Draw stiles
  ctx.fillStyle = "#ffffffaa";
  positions.forEach(pos => {
    const x = parseFloat(pos) * scale;
    ctx.fillRect(x, 0, stile * scale, canvas.height);
  });

  // Draw dado if applicable
  if (style.includes("dado")) {
    const y = (1 - dado / ceiling) * canvas.height;
    ctx.strokeStyle = "#00ffffaa";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}