const {S3Client, 
    DeleteObjectCommand, 
    GetObjectCommand, 
    ListObjectsV2Command,
    PutObjectCommand} = require ("@aws-sdk/client-s3")

require('dotenv').config()
const fs = require('fs')
const { get } = require('https')
const { promisify } = require('util')

const bucketName =  process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
})
const pipelineAsync = promisify(require('stream').pipeline)
//upload file to s3 method
async function uploadFile(file, originalFileName) {
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: originalFileName,
        ContentType: file.mimetype // Set the content type here
    }
    return s3.send(new PutObjectCommand(uploadParams))
}
exports.uploadFile = uploadFile

//download a file from s3 method
async function getFileStream(fileKey) {
    const downloadParams = {
        Key : fileKey,
        Bucket : bucketName
    }
    try {
        const data = await s3.send(new GetObjectCommand(downloadParams))
        return data.Body
    }
    catch (error) {
        console.error("Error getting file from S3:", error)
        throw error
    }
}
exports.getFileStream = getFileStream

//List all the files from s3 
async function listFilesFromS3() {
    const params = {
        Bucket: bucketName
    }
    try {
        const data = await s3.send(new ListObjectsV2Command(params))
        return data.Contents
    } catch (error) {
        console.error("Error listing files from S3:", error)
        throw error
    }
}


//delete the object from s3
async function deleteFileFromS3(fileKey) {
    const deleteParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    try {
        const data = await s3.send(new DeleteObjectCommand(deleteParams))
        return data
    } catch (error) {
        console.error("Error getting file from S3:", error)
        throw error
    }

}
exports.deleteFileFromS3 = deleteFileFromS3
module.exports = {
    uploadFile,
    getFileStream,
    listFilesFromS3,
    deleteFileFromS3
};