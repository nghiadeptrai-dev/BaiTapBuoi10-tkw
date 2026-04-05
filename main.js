class SinhVien {
  constructor(stt, maSV, hoTen) {
    this.stt = stt;
    this.maSV = maSV.toLowerCase();
    this.hoTen = hoTen;

    this.email = this.taoEmail();
    this.khoaHoc = "K" + this.maSV.substring(0,2);
    this.khoa = this.getKhoa();
  }

  tachTen() {
    let parts = this.hoTen.trim().split(" ");
    return {
      ten: parts[parts.length - 1],
      hoDem: parts.slice(0, parts.length - 1)
    };
  }

  boDau(str) {
    return str.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");
  }

  taoEmail() {
    let { ten, hoDem } = this.tachTen();
    let vietTat = hoDem.map(x => x[0]).join("");

    return this.boDau(ten).toLowerCase() +
           this.boDau(vietTat).toLowerCase() +
           "." + this.maSV +
           "@hvnh.edu.vn";
  }

  getKhoa() {
    let code = this.maSV.substring(2,5);
    if(code === "a40") return "Công nghệ thông tin";
    return "Khác";
  }
}


// Đọc file
document.getElementById("fileInput").addEventListener("change", function(e){
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e){
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    render(json);
  };

  reader.readAsArrayBuffer(file);
});


function render(data){
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const sv = new SinhVien(row.STT, row["Mã SV"], row["Họ tên"]);

    tbody.innerHTML += `
      <tr>
        <td>${sv.stt}</td>
        <td>${sv.maSV}</td>
        <td>${sv.hoTen}</td>
        <td>${sv.email}</td>
        <td>${sv.khoaHoc}</td>
        <td>${sv.khoa}</td>
      </tr>
    `;
  });
}