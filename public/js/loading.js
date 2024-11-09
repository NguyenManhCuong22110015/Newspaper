// Set the inner HTML
document.querySelector(".data").innerHTML = `
  <div id="loading-spinner" class="" style="height: 100vh;">
    <span class="sr-only me-3">Loading...</span>
    <l-bouncy size="60" speed="1.75" color="yellow"></l-bouncy>
  </div>
`;

// Create and append the script
const script = document.createElement("script");
script.type = "module";
script.src = "https://cdn.jsdelivr.net/npm/ldrs/dist/auto/bouncy.js";
document.body.appendChild(script);
