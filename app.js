let fName;
let arrSize = 100;
let newArr;
const objData = {
  data: {},
  setdata(data) {
    this.data = data;
  },
  init(element) {
    let self = this;

    let fileElement = document.querySelector(element);
    if (fileElement) {
      fileElement.addEventListener("change", (event) => {
        let file = event.target.files[0];
        fName = file.name.split(".")[0];

        const reader = new FileReader();

        reader.onload = function (e) {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          self.setdata(jsonData);

          self.divideArr(arrSize);
          self.processArr();
        };

        reader.readAsArrayBuffer(file);
      });
    }
  },

  requestAPI(cutData) {
    fetch("http://localhost/csvtojsarr/process.php", {
      method: "POST",
      body: JSON.stringify(cutData),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        
      });
  },

  divideArr(arrSize) {
    let mainData = this.data;
    newArr = [];
    let temp = [];
    mainData.forEach((item, count) => {
      temp.push(item);
      if ((count + 1) % arrSize === 0 || count === mainData.length - 1) {
        newArr.push(temp);
        temp = [];
      }
    });
    return newArr;
  },

  processArr() {
    for (let i = 0; i < newArr.length; i++) {
      let smallAr = newArr[i];
      let res = this.requestAPI(smallAr);
      console.log(res);
    }
    
  },
};

objData.init("#fileInput");