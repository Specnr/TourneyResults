import { archiveResult } from "../../../public/helpers/mongo/manipulate"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Cannot accept request" })
    return
  }
  if (process.env.NODE_ENV !== "development") {
    res.status(401).json({ message: "Do not have access to this route" })
    return
  }

  const { name } = req.body
  if (name == null || name === "") {
    res.status(400).json({ message: "Invalid name" })
    return
  }
  
  const result = await archiveResult(name)
  res.status(200).json({
    success: true,
    modifiedCount: result.modifiedCount
  })
}