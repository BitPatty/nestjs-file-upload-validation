# NestJS File Upload Validation

This is a sample project showing how to validate file uploads.

The process includes:

1. Checking the file size before receiving the file
2. Checking if a `MIME type` is present before receiving the file
3. Checking the `MIME type` before receiving the file
4. Receiving and storing the file with a generated filename in `/tmp`
5. Rechecking the `MIME type` after storing the file
6. Comparing the file's `Magic Type` to the `MIME type` provided by the request
