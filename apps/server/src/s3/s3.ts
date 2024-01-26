import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_BUCKET_REGION,
});

export const uploadFileS3Bucket = async (file: any) => {
	const { createReadStream, filename, mimetype, encoding } = await file;

	const stream = createReadStream();

	const params = {
		Bucket: process.env.AWS_BUCKET_NAME as string,
		Key: new Date().toISOString() + filename,
		Body: stream,
		ContentType: mimetype,
	};

	return await s3.upload(params).promise();
};
