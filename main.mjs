import fs from "node:fs";
import express from "express";
import { PrismaClient } from "@prisma/client";
import escapeHTML from "escape-html";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));
const prisma = new PrismaClient();

const template = fs.readFileSync("./template.html", "utf-8");
app.get("/", async (request, response) => {
  const posts = await prisma.post.findMany();
  const html = template.replace(
    "<!-- posts -->",
    posts.filter((post) => post.message !== ""
    ).map((post) => `<button type="button" id="increment">♥</button><div>${escapeHTML(post.message)}</div>`
    ).join("<br>"),
  );
  response.send(html);
});



app.post("/send", async (request, response) => {
  await prisma.post.create({
    data: { message: request.body.message },
  });
  response.redirect("/");
});

app.listen(3000);
