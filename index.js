const app = require("./app");

const {PORT} = process.env

app.listen(PORT, ()=>{
    console.log(`console is up and running on port ${PORT}`);
})
