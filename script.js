document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarButton = document.getElementById('toggleSidebar');
    const draggables = document.querySelectorAll('.draggable');
    const dropArea = document.getElementById('dropArea');
    const postButton = document.getElementById('postButton');
    const feed = document.getElementById('feed');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close');

    toggleSidebarButton.addEventListener('click', function () {
        sidebar.classList.toggle('open');
    });

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', e.target.src);
        });
    });

    dropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropArea.classList.add('hover');
    });

    dropArea.addEventListener('dragleave', function () {
        dropArea.classList.remove('hover');
    });

    dropArea.addEventListener('drop', function (e) {
        e.preventDefault();
        dropArea.classList.remove('hover');
        const imgSrc = e.dataTransfer.getData('text/plain');
        const newImage = document.createElement('img');
        newImage.src = imgSrc;
        newImage.style.position = 'absolute';
        newImage.style.left = `${e.clientX - dropArea.offsetLeft - 50}px`;
        newImage.style.top = `${e.clientY - dropArea.offsetTop - 50}px`;
        dropArea.appendChild(newImage);
    });

    postButton.addEventListener('click', function () {
        const images = dropArea.querySelectorAll('img');
        if (images.length === 0) return;

        // Set canvas size to the size of the drop area
        canvas.width = dropArea.offsetWidth;
        canvas.height = dropArea.offsetHeight;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw each image on the canvas
        images.forEach(image => {
            const rect = image.getBoundingClientRect();
            const dropAreaRect = dropArea.getBoundingClientRect();
            const x = rect.left - dropAreaRect.left;
            const y = rect.top - dropAreaRect.top;
            ctx.drawImage(image, x, y, image.width, image.height);
        });

        // Convert canvas to image once all images are drawn
        setTimeout(() => {
            const dataURL = canvas.toDataURL('image/png');
            const postImage = document.createElement('img');
            postImage.src = dataURL;

            // Create post element and append the image
            const post = document.createElement('div');
            post.classList.add('post');
            post.appendChild(postImage);

            // Append post to feed
            feed.appendChild(post);

            // Clear the drop area
            dropArea.innerHTML = '<p>Drag and drop clothes here to create an outfit</p>';

            // Add event listener to open modal on post click
            post.addEventListener('click', function () {
                modal.style.display = 'block';
                modalImg.src = dataURL;
            });
        }, 500); // Delay to ensure images are fully loaded
    });

    // Close modal when the close button is clicked
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close modal when clicked outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
