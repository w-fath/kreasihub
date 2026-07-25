require('dotenv').config();

const express = require('express');
const cors = require('cors');

const database = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'KreasiHub API berjalan.',
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use("/api/categories", categoryRoutes);

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Endpoint tidak ditemukan.',
    });
});

const startServer = async () => {
    try {
        const connection = await database.getConnection();

        console.log('Database MySQL berhasil terhubung.');

        connection.release();

        app.listen(PORT, () => {
            console.log(`Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Gagal terhubung ke database:', error.message);
        process.exit(1);
    }
};

startServer();