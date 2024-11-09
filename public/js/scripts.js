const imagesToUpload = [];

// Function to show or hide the loading overlay
function toggleLoading(isLoading) {
  const overlay = document.getElementById('loading-overlay');
  overlay.style.display = isLoading ? 'flex' : 'none';
}

// Initialize Summernote
$('#summernote').summernote({
  placeholder: 'Write your article here...',
  tabsize: 2,
  height: 1000,
  callbacks: {
    onImageUpload: function(files) {
      for (let file of files) {
        const objectURL = URL.createObjectURL(file);
        imagesToUpload.push({ file, placeholder: objectURL });
        $('#summernote').summernote('insertImage', objectURL);
      }
    }
  }
});


// Event listener for the save button
$('#save-button').on('click', function() {
  const title = $('#title').val().trim();
  let content = $('#summernote').summernote('code');

  toggleLoading(true); // Show loading overlay before upload starts

  // Upload each image and replace the placeholders with cloud URLs
  const uploadPromises = imagesToUpload.map(({ file, placeholder }) => 
    uploadToCloud(file).then(url => ({ placeholder, url }))
  );

  Promise.all(uploadPromises)
    .then(results => {
      results.forEach(({ placeholder, url }) => {
        content = content.replace(new RegExp(placeholder, "g"), url);
      });
      return saveArticle({ title, content });
    })
    .then(() => {
      alert('Article saved successfully!');
    })
    .catch(error => {
      console.error("Error saving article:", error);
      alert('Error saving article.');
    })
    .finally(() => toggleLoading(false)); // Hide loading overlay after process finishes
});

function uploadToCloud(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    
    $.ajax({
      url: '/upload-image',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: response => resolve(response.imageUrl),
      error: reject
    });
  });
}

async function saveArticle(articleData) {
  try {
    const response = await fetch('/save-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) throw new Error('Failed to save article');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Initialize overlay on page load
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      const articleData = { 
        title: document.getElementById('title').value, 
        content: $('#summernote').summernote('code') 
      };
      saveArticle(articleData);
    });
  }
});
