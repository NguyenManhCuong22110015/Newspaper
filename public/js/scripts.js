const imagesToUpload = [];  
const existingImages = new Set();  

function toggleLoading(isLoading) {
  const overlay = document.getElementById('loading-overlay');
  overlay.style.display = isLoading ? 'flex' : 'none';
}

$('#summernote').summernote({
  placeholder: 'Write your article here...',
  tabsize: 2,
  height: 1000,
  callbacks: {
    onImageUpload: function(files) {
      for (let file of files) {
        const objectURL = URL.createObjectURL(file);
        imagesToUpload.push({ file, placeholder: objectURL }); // Thêm ảnh mới vào danh sách
        $('#summernote').summernote('insertImage', objectURL); // Hiển thị ảnh trong editor
      }
    },
    onInit: function() {
      const content = $('#summernote').summernote('code');
      // Lấy danh sách ảnh đã có từ nội dung bài viết và lưu vào `existingImages`
      $(content)
        .find('img')
        .each((_, img) => {
          existingImages.add(img.src);
        });
    }
  }
});

// Hàm lưu bài viết
$('#save-button').on('click', function() {
  const title = $('#title').val().trim();
  const summary = $('#summary').val().trim();
  const category = $('#category').val().trim();
  const tags = $('#tags').val().trim();

  let content = $('#summernote').summernote('code');

  toggleLoading(true); // Hiển thị overlay loading

  // Chỉ upload ảnh chưa có trên Cloud
  const uploadPromises = imagesToUpload.map(({ file, placeholder }) => 
    uploadToCloud(file).then(url => ({ placeholder, url }))
  );

  Promise.all(uploadPromises)
    .then(results => {
      // Thay thế các ảnh tải lên bằng URL từ Cloud
      results.forEach(({ placeholder, url }) => {
        content = content.replace(new RegExp(placeholder, "g"), url);
      });
      return saveArticle({ title, content, summary, category, tags });
    })
    .then(() => {
      alert('Article saved successfully!');
      imagesToUpload.length = 0; // Xóa danh sách ảnh sau khi lưu thành công
    })
    .catch(error => {
      console.error("Error saving article:", error);
      alert('Error saving article.');
    })
    .finally(() => toggleLoading(false)); // Ẩn overlay loading
});

// Hàm cập nhật bài viết
$('#update-button').on('click', function() {
  const id = +$('#id').val().trim();
  const title = $('#title').val().trim() || "";
  const summary = $('#summary').val().trim() || "";
  const category = $('#category').val().trim() || "";
  const tags = $('#tags').val().trim() || "";
  let content = $('#summernote').summernote('code');

  toggleLoading(true); // Hiển thị overlay loading

  // Chỉ upload ảnh chưa có trên Cloud
  const uploadPromises = imagesToUpload.map(({ file, placeholder }) => 
    uploadToCloud(file).then(url => ({ placeholder, url }))
  );

  Promise.all(uploadPromises)
    .then(results => {
      results.forEach(({ placeholder, url }) => {
        content = content.replace(new RegExp(placeholder, "g"), url);
      });
      return updateArticle({ id, title, content, summary, category, tags });
    })
    .then(() => {
      alert('Article updated successfully!');
      imagesToUpload.length = 0; // Xóa danh sách ảnh sau khi cập nhật thành công
    })
    .catch(error => {
      console.error("Error updating article:", error);
      alert('Error updating article.');
    })
    .finally(() => toggleLoading(false)); // Ẩn overlay loading
});

// Hàm tải ảnh lên Cloud
function uploadToCloud(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    $.ajax({
      url: '/upload-image', // Endpoint để tải ảnh lên
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: response => resolve(response.imageUrl),
      error: error => reject(error.responseJSON || error)
    });
  });
}

// Hàm lưu bài viết
async function saveArticle(articleData) {
  try {
    const response = await fetch('/writer/save-article', {
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

// Hàm cập nhật bài viết
async function updateArticle(articleData) {
  try {
    const response = await fetch('/writer/update-article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(articleData),
    });

    if (!response.ok) throw new Error('Failed to update article');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
