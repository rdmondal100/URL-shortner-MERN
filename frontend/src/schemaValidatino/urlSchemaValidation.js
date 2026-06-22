import z from 'zod'

const aliasPattern = /^[a-zA-Z0-9][a-zA-Z0-9-_]{2,39}$/

const urlSchemaValidation = z.object({
  url: z.string().trim().url({ message: "Please enter a valid URL" }),
  customAlias: z
    .string()
    .trim()
    .max(40, { message: "Custom alias must be 3-40 characters" })
    .refine((value) => value === "" || aliasPattern.test(value), {
      message: "Use letters, numbers, hyphens, or underscores only",
    }),
})

export default urlSchemaValidation