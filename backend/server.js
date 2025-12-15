const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
  accessKeyId: 'test',
  secretAccessKey: 'test',
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  s3ForcePathStyle: true
});

const s3 = new AWS.S3();
const BUCKET_NAME = 'shopping-images';

(async () => {
  try {
    await s3.createBucket({ Bucket: BUCKET_NAME }).promise();
    console.log(`Bucket ${BUCKET_NAME} criado`);
  } catch (err) {}
})();

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    await s3.upload(params).promise();
    res.json({ message: 'Imagem enviada com sucesso!' });
  } catch {
    res.status(500).json({ error: 'Erro ao enviar imagem' });
  }
});

app.listen(3000, () => {
  console.log('Backend rodando na porta 3000');
});
