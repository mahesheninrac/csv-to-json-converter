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

          self.requestAPI();
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
        console.log(objData.divideArr(arrSize));
      });
  },

  divideArr(arrSize) {
    let mainData = this.data;
    newArr = [];
    for (let i = 0; i < mainData.length; i += arrSize) {
      newArr.push(mainData.slice(i, i + arrSize));
    }
    return newArr;
  },

  processArr(newArr){
    let smallAr = []
    for(let i=0; i<newArr.length; i++){
      smallAr=newArr[i]
      let res = this.requestAPI(smallAr)
      console.log(res)
    }
    return smallAr;
  }

 
  
};

objData.init("#fileInput");
objData.processArr(newArr)