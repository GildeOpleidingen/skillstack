// const contributions = {
//   "2025-08-06": 3,
//   "2025-08-05": 2,
//   "2025-07-10": 5,
//   "2025-07-01": 1,
//   "2025-06-25": 4,
// };

export async function renderHeatmap(contributions) {
  console.log('Contributions: ', contributions);
  const heatmap = document.getElementById("heatmap");
  const monthsRow = document.getElementById("months");

  // Parse and sort the dates
  const dates = Object.keys(contributions).sort();
  const startDate = new Date(dates[0]);
  const endDate = new Date(dates[dates.length - 1]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  console.log(today);

  // Align startDate to the previous Sunday
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);
  startDate.setHours(0, 0, 0, 0);

  // Calculate number of weeks to render
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const weeksToShow = Math.ceil(totalDays / 7);

  let lastMonth = null;

  for (let w = 0; w < weeksToShow; w++) {
    const weekCol = document.createElement("div");
    weekCol.className = "week";
    weekCol.style.display = "flex";
    weekCol.style.flexDirection = "column";
    weekCol.style.gap = "2px";

    const weekStartDate = new Date(startDate);
    weekStartDate.setDate(startDate.getDate() + w * 7);

    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(weekStartDate);
      cellDate.setDate(weekStartDate.getDate() + d);
      cellDate.setHours(0, 0, 0, 0);

      // Don't render future days
      if (cellDate > today+1) continue;

      const isoDate = cellDate.toISOString().split("T")[0];
      const count = contributions[isoDate] || 0;

      const cell = document.createElement("div");
      cell.className = "day";
      cell.title = `${isoDate}: ${count} problem${count !== 1 ? 's' : ''}`;
      cell.style.width = "12px";
      cell.style.height = "12px";
      cell.style.borderRadius = "2px";
      cell.style.backgroundColor = getColor(count);

      weekCol.appendChild(cell);

      // Month labels — only on the first row (e.g. Sunday)
      if (d === 0) {
        const currentMonth = cellDate.getMonth();
        const monthLabel = cellDate.toLocaleString("default", { month: "short" });

        const monthCell = document.createElement("div");
        monthCell.style.width = "12px";
        monthCell.style.fontSize = "10px";
        monthCell.style.textAlign = "center";

        if (currentMonth !== lastMonth) {
          monthCell.textContent = monthLabel;
          lastMonth = currentMonth;
        }

        monthsRow.appendChild(monthCell);
      }
    }

    heatmap.appendChild(weekCol);

    // Scroll to the right after rendering
    const scrollContainer = heatmap.parentElement;
    scrollContainer.scrollLeft = scrollContainer.scrollWidth;

  }

  function getColor(count) {
    if (count === 0) return "#ebedf0";
    if (count === 1) return "#9be9a8";
    if (count === 2) return "#40c463";
    if (count <= 4) return "#30a14e";
    return "#216e39";
  }
}
