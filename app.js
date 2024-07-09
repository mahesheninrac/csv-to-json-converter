let fName;
let arrSize = 100;
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

          self.requestAPI();
        };

        reader.readAsArrayBuffer(file);
      });
    }
  },

  requestAPI() {
    fetch("http://localhost/csvtojsarr/process.php", {
      method: "POST",
      body: JSON.stringify(this.data),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        console.log(objData.divideArr(arrSize));
        console.log()
      });
  },

  divideArr(arrSize) {
    let mainData = this.data;
    let newArr = [];
    for (let i = 0; i < mainData.length; i += arrSize) {
      newArr.push(mainData.slice(i, i + arrSize));
    }
    return newArr;
  },

  processMainArr(newArr){
    let chunk;
    for(let i; i<newArr.length; i++){
      chunk = newArr[i]
    }
    return chunk
  }
};

objData.init("#fileInput");
