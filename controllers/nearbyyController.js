require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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
  console.log("Uploading file to GCS:", filePath);

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
      res.send({ fileUrl }); // Ensure the URL is sent in an object
    } else {
      console.error("Error uploading file:", error);
      res.status(500).send(`Error uploading file: ${error}`);
    }
  } catch (error) {
    console.error("Error uploading to GCS:", error);
    res.status(500).send(`Error uploading to GCS: ${error}`);
  }
};

async function getContextResponse(req, res) {
    const {message, pastMessages,pastAnswers, documents} = req.query;

    const nearbyy = await nearbyyPromise;
    const context = await nearbyy.semanticSearch({
        limit: 3,
        query: message,
    });

    const context2 = await nearbyy.semanticSearch({
      limit: 3,
      query: pastMessages,
    });

    const context3 = await nearbyy.semanticSearch({
      limit: 3,
      query: pastAnswers,
    });
  
    const context4 = await nearbyy.semanticSearch({
      limit: 3,
      query: documents,
    });
  
    if (!context.success) {
        console.error("Error:", context.error);
        return res.send("I'm sorry, I don't understand.");	
    }

    console.log(documents);

    const ctxMsg = context.data.items.map((item) => item.text).join("\n\n");
    const ctxMsg2 = context2.data.items.map((item) => item.text).join("\n\n");
    const ctxMsg3 = context3.data.items.map((item) => item.text).join("\n\n");
    const ctxMsg4 = context4.data.items.map((item) => item.text).join("\n\n");

    const combinedContext = `${ctxMsg}\n\nPAST MESSAGES:\n${ctxMsg2}\n\nPAST ANSWERS:\n${ctxMsg3}\n\nDOCUMENTS:\n${ctxMsg4}`;
    console.log(combinedContext);
    const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAi.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: "RELEVANT CONTEXT TO THE USER'S QUERY, THIS IS THE MAIN CONTEXT YOU NEED TO ANSWER TO:\n " + ctxMsg + "ADIITIONAL CONTEXT PAST MESSAGES OR PROMPTS:\n" + ctxMsg2 + "PAST ANSWERS:\n" + ctxMsg3 + "DOCUMENTS:\n" + ctxMsg4}],
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
        console.error('Error en la comunicación con la API', error);
        res.status(500).send(error);
      }
}

module.exports = { handleFileUpload, getContextResponse };
