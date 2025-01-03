// api/save-joki.js

export default async function handler(req, res) {
  const formData = req.body;

  try {
    const backendResponse = await fetch(
      process.env.BACKEND_URL + "/api/save-joki", // Mengakses BACKEND_URL dari environment variable
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (backendResponse.ok) {
      const data = await backendResponse.json();
      res.status(200).json(data);
    } else {
      const errorData = await backendResponse.json();
      res.status(backendResponse.status).json(errorData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}