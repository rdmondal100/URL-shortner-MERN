
import { nanoid } from 'nanoid'

import URL from "../models/url.model.js"

const handleGenerateNewShortCode =async (req,res)=>{

  const body = req.body
  console.log(body)
  console.log(body.url)
  
  if(!body.url){
    return res.status(400).json({error:"Url is required"})
  }
  const shortId = nanoid(8)
console.log(shortId)
      const newUrl = await URL.create({
        shortId:shortId,
        redirectURL:body.url,
        visitHistory:[]
      })
      console.log("The new url is :",newUrl)

      return res.status(200).json(newUrl)
}

export default handleGenerateNewShortCode