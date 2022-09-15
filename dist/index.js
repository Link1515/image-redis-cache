var _a, _b;
import express from 'express';
import dotenv from 'dotenv';
// routes
import image from './routes/image';
// set env
const currentEnv = (_b = (_a = process.env.NODE_ENV) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : 'development';
dotenv.config({ path: `./.env.${currentEnv}` });
const app = express();
app.use('/image', image);
app.listen(process.env.PORT, () => {
    console.log(`server running at: http://localhost:${process.env.PORT}`);
});
