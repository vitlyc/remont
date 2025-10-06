import { Divider } from "@mui/material"
import TextField from "@mui/material/TextField"
import { useState } from "react"

export default function Comments() {
  const [value, setValue] = useState("")

  return (
    <>
      <Divider fullWidth />
      <TextField
        id=""
        label=""
        fullWidth
        multiline
        rows={3}
        placeholder="Введите комментарии к делу..."
      />
    </>
  )
}
