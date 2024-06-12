require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const {GoogleGenerativeAI} = require('@google/generative-ai');
const path = require('path');

async function initializeNearbyyClient() {
  const module = await import('@nearbyy/core');
  return new module.NearbyyClient({
    API_KEY: process.env.NEARBYY_API_KEY
  });
}

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_KEYFILE_PATH,
});
const bucketName = process.env.GCS_BUCKET_NAME;

const generateSignedUrl = async (bucketName, fileName) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
  return url;
};

const nearbyyPromise = initializeNearbyyClient();

const handleFileUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = path.resolve(req.file.path);
  const destination = req.file.filename;
  const nearbyy = await nearbyyPromise;

  try {
    await storage.bucket(bucketName).upload(filePath, {
      destination: destination,
      contentType: 'application/pdf',
    });

    const fileUrl = await generateSignedUrl(bucketName, destination);

    const { success, error, data } = await nearbyy.uploadFiles({
      fileUrls: [fileUrl],
    });

    if (success) {
      console.log("Files uploaded successfully:", data);
      res.send("File uploaded and processed successfully.");
    } else {
      console.error("Error uploading file:", error);
      res.status(500).send(`Error uploading file: ${error}`);
    }
  } catch (error) {
    console.error("Error uploading to GCS:", error);
    res.status(500).send(`Error uploading to GCS: ${error}`);
  }
};

async function getContextResponse(req, res){
    const {message} = req.query;

    const nearbyy = await nearbyyPromise;
    const context = await nearbyy.semanticSearch({
        limit: 3,
        query: message,
    });

    if(!context.success){
        console.error("Xd",context.error);
        return res.send("I'm sorry, I don't understand.");	
    }

    const ctxMsg = context.data.items.map((item) => item.text).join("\n\n");

    console.log("Contexto: ", ctxMsg);

    const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAi.getGenerativeModel({model: 'gemini-1.5-flash'});

    try {
        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: "RELEVANT CONTEXT TO THE USER'S QUERY:\n " + ctxMsg}],
            },
            {
              role: 'model',
              parts: [
                {
                  text: "If you are given relevant context, answer the users query with it. If the context does not include the answer, STATE that you don't have enough information to answer the query but still try to answer it without the context.",
                },
              ],
            },
          ],
        });
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        return res.json({ response: text });
      } catch (error) {
        console.error('Error en la comunicacion con la api', error);
        res.status(500).send(error);
      }
}


module.exports = {handleFileUpload, getContextResponse};

