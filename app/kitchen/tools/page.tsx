import Tools from '@/components/kitchen/tools'
import { Grid } from '@mui/material/'

export default async function KitchenTool() {
  return (
    <Grid
      container
      spacing={2}
    >
      <Tools />
    </Grid>
  )
}
