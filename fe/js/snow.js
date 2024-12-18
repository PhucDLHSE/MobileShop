// Số lượng bông tuyết bạn muốn tạo
const snowflakeCount = 50;

// Hàm tạo bông tuyết
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄'; // Biểu tượng bông tuyết

    // Thiết lập vị trí ngẫu nhiên
    snowflake.style.left = `${Math.random() * 100}vw`;
    snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`; // Thời gian rơi
    snowflake.style.opacity = Math.random();
    snowflake.style.fontSize = `${Math.random() * 1.5 + 0.5}em`;

    document.body.appendChild(snowflake);

    // Xóa bông tuyết sau khi kết thúc hiệu ứng
    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

// Lặp lại để tạo bông tuyết liên tục
setInterval(createSnowflake, 100);
