const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Kiểm tra kích thước file
    const fileSizeMB = file.size / (1024 * 1024);
    console.log(`File được chọn: ${file.name}, kích thước: ${fileSizeMB.toFixed(2)}MB, loại: ${file.type}`);
    
    // Kiểm tra nếu là video và kích thước quá lớn
    if (file.type.startsWith('video/') && fileSizeMB > 90) {
      toast.warning(`Video có kích thước ${fileSizeMB.toFixed(2)}MB. Nên chọn video nhỏ hơn 90MB để tránh lỗi.`);
    } else if (fileSizeMB > 95) {
      toast.error(`File quá lớn (${fileSizeMB.toFixed(2)}MB). Vui lòng chọn file nhỏ hơn 95MB.`);
      event.target.value = '';
      return;
    }
    
    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    setFileType(file.type.startsWith('video') ? 'video' : 'image');
  }
}; 