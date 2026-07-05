const xlsx = require("xlsx");
const mongoose = require("mongoose");

mongoose.connect(process.env.key);

const Product = mongoose.model("Product", {
  name: String,
  quantity: Number,
  expiry: Date
});

const file = xlsx.readFile("daroo.xlsx");
const data = xlsx.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);

async function run() {
  for (let item of data) {
    await Product.create({
      name: item.name || item.نام,
      quantity: item.quantity || item.تعداد,
      expiry: item.expiry || item.انقضا
    });
  }
  console.log("DONE");
}

run();
