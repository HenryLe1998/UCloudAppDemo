const express = require('express')
const cors = require('cors')
//set up to remove the file from server after upload to s3
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const http = require('http') // Import the 'https' module
const path = require('path')

const multer = require('multer')
const upload = multer({dest: 'uploads/'})


const { uploadFile, getFileStream, listFilesFromS3, deleteFileFromS3 } = require('./s3') 

const app = express()
const server = http.createServer(app)

app.get('/files/:fileName', async (req, res) => {
  const { fileName } = req.params;
  try {
    const fileStream = await getFileStream(fileName)
    console.log("Download Object Confirmed")
    res.attachment(fileName)
    fileStream.pipe(res)
  } catch (error)
  {
    console.error('Error downloading file server.js:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/files', async (req, res) => {
  try {
    const files = await listFilesFromS3()
    res.json(files);
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    res.status(500).send('Internal Server Error in app.get');
  }
})

app.post('/images', upload.single('image'), async (req, res) => {
    const file  = req.file
    const originalFileName = req.file.originalname
    console.log("Upload File Infor")
    console.log(file)
    const result = await uploadFile(file, originalFileName)
    await unlinkFile(file.path)
    console.log(result)
    const description = req.body.description
    res.send({ imagePath: `/images/${result.Key}` })
})

app.delete('/files/:fileName', async (req, res) => {
  const { fileName } = req.params;
  try {
    // Delete file from S3 bucket
    console.log("Delete Object Sucessful")
    await deleteFileFromS3(fileName)
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).send('Internal Server Error in app.delete');
  }
})


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
  });
}

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT} with HTTP`)
})