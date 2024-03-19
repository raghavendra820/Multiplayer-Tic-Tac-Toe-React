import express from "express";
import cors from "cors";
import { StreamChat } from "stream-chat";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
const app = express();

app.use(cors());
app.use(express.json());
const api_key = "b5r5n3e76dfd";
const api_secret =
  "emydzhszyk5wbk8kwud3r6ymqf8bbrwd5var4j34zw25mz69hpmkhzfnqfvvckcv";
const serverClient = StreamChat.getInstance(
  "b5r5n3e76dfd",
  "xyk7mtdaz4xbhgmvrcfdcwydwy7ta7weqsjrjnkxsa52fcqu4kpt8w4cr2hzhd2w"
);

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createToken(userId);
    res.json({ token, userId, firstName, lastName, username, hashedPassword });
  } catch (error) {
    res.json(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const { users } = await serverClient.queryUsers({
      name:  username ,
    });
    if (users.length === 0) return res.json({ message: "User not found" });
    const token = serverClient.createToken(users[0].id);
    const passwordMatch = await bcrypt.compare(
      password,
      users[0].hashedPassword
      );


      if (passwordMatch) {
      res.json({
        token,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        username,
        userId: users[0].id,
      });
    }
  } catch (error) {
    res.json(error);
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
