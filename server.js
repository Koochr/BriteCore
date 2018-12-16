const express = require("express")
const fs = require("fs")
const app = express()

/*eslint-disable-next-line*/
app.listen(4000, () => { console.log("Server started") })
app.get("/", async (req, res) => {
	res.sendFile (__dirname + "/public/index.html")
})
app.post("/:filename", (req, res) => {
	let body = ""
	req.on("data", data => {
		body += data
	})
	req.on("end", () => {
		fs.writeFile(`${__dirname}/data${req.url}`, body, (err) => {
			if (err) {
				res.status(500).send("Internal server error")
			}
			res.status(200).send("OK")
		})
	})
})
app.use(express.static("public"))
app.use(express.static("data"))

app.use((req, res) => { res.status(404).send("404: Not found") })
