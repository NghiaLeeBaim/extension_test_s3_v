document
    .getElementById("s3-form")
    .addEventListener("submit", async function(event) {
        event.preventDefault();

        const endpoint = document.getElementById("endpoint").value;
        const region = document.getElementById("region").value;
        const accessKey = document.getElementById("accesskey").value;
        const secretKey = document.getElementById("secretkey").value;
        const bucket = document.getElementById("bucket").value;
        const file = document.getElementById("file").files[0];

        const s3 = new AWS.S3({
            endpoint: endpoint,
            region: region,
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            s3ForcePathStyle: true,
        });

        const uploadParams = {
            Bucket: bucket,
            Key: file.name,
            Body: file,
        };

        const startTime = new Date().getTime();

        try {
            await s3.upload(uploadParams).promise();
            const uploadEndTime = new Date().getTime();
            const uploadSpeed = (file.size / (uploadEndTime - startTime)) * 1000; // bytes per second

            const downloadParams = {
                Bucket: bucket,
                Key: file.name,
            };

            const downloadStartTime = new Date().getTime();
            await s3.getObject(downloadParams).promise();
            const downloadEndTime = new Date().getTime();
            const downloadSpeed =
                (file.size / (downloadEndTime - downloadStartTime)) * 1000; // bytes per second

            document.getElementById(
                "result"
            ).innerText = `Upload speed: ${uploadSpeed.toFixed(
        2
      )} Bps\nDownload speed: ${downloadSpeed.toFixed(2)} Bps`;
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("result").innerText =
                "Error occurred. Check console for details.";
        }
    });