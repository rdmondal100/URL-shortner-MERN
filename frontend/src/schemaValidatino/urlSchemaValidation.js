import z from 'zod'




const urlSchemaValidation = z.object({
  url: z.string().url({message:"Please enter a valid URL"})
})


export default urlSchemaValidation