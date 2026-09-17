const bcrypt = require("bcrypt");

async function test() {
  const hash = await bcrypt.hash("123456", 10);
  console.log(hash);
}

test();