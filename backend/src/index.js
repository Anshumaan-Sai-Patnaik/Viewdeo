import { app } from "./app.js";

const PORT = 3000

app.listen(PORT, () => {
  console.log(`Listening to Port: ${PORT}`)
})

app.get('/', (req, res)=> {
  res.send("Hi");
})
