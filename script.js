document.addEventListener('DOMContentLoaded', () => {
  const dnaInput         = document.getElementById('dnaInput');
  const translateBtn     = document.getElementById('translateBtn');
  const restartBtn       = document.getElementById('restartBtn');
  const resultsDiv       = document.getElementById('resultsArea');
  const progressBox      = document.getElementById('progressContainer');
  const progressBar      = document.getElementById('progressBar');

  // Each click on "Translate" calls your C code's main() with the DNA string as argv[1].
  translateBtn.addEventListener('click', () => {
    // Remove placeholder text if it's there
    if (resultsDiv.querySelector('.placeholder')) {
      resultsDiv.innerHTML = "";
    }
    // Add a horizontal rule between consecutive runs
    if (resultsDiv.innerHTML.trim()) {
      resultsDiv.innerHTML += "<hr/>";
    }

    const userDNA = dnaInput.value.trim();
    if (!userDNA) {
      resultsDiv.innerHTML += "<p class='notice'>Please enter a DNA sequence.</p>";
      return;
    }

    // Show a quick progress bar “simulation”
    progressBox.classList.remove('hidden');
    progressBar.style.width = "0%";
    animateProgress(() => {
      // Once progress finishes, call the translator
      resultsDiv.innerHTML += `<p><strong>Translating:</strong> ${userDNA}</p>`;
      Module.callMain([ userDNA ]);

      // Check after a short delay if it was successful
      setTimeout(() => {
        if (resultsDiv.innerHTML.includes("exit code 0")) {
          // Show a subtle success message
          resultsDiv.innerHTML += `<p class="successMsg">Translation completed successfully!</p>`;
        }
      }, 200);
    });
  });

  // "Restart" clears the DNA field and results but keeps the runtime alive
  restartBtn.addEventListener('click', () => {
    dnaInput.value = "";
    resultsDiv.innerHTML = "<p class='placeholder'>Results cleared. Enter a new sequence above.</p>";
  });

  // Animates progress bar from 0% to 100% over ~1 second, then calls back
  function animateProgress(doneCallback) {
    let width = 0;
    const interval = setInterval(() => {
      width += 5; 
      progressBar.style.width = `${width}%`;
      if (width >= 100) {
        clearInterval(interval);
        // Hide bar once “full”
        setTimeout(() => {
          progressBox.classList.add('hidden');
          progressBar.style.width = "0%";
          doneCallback();
        }, 200);
      }
    }, 40);
  }
});
