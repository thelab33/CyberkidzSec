// static/js/elite/dashboard_chart.js
document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('dashboardChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        label: 'Bug Counts',
        data: [5, 12, 8, 3]
      }]
    }
  });
});
