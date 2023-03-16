import express from 'express';
import { connectDatabase } from './connectDatabase';
import cors from 'cors';
import todoRoutes from './routes/todo'
import userRoutes from './routes/user'

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(cors());
app.use("/user", userRoutes)
app.use("/todo", todoRoutes)


app.get('/', async (req, res) => {
    res.send('Server Up!!!');
});


connectDatabase()
    .then(() =>
        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`);
        })
    )
    .catch((err) => console.error(err));
