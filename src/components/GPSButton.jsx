import { Button, Collapse, LinearProgress, makeStyles } from "@material-ui/core"
import GpsFixedIcon from "@material-ui/icons/GpsFixed"
import React from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}))

const SearchButton = ({ loading = false, onRequestSearch }) => {
  const classes = useStyles()

  const handleRequestSearch = (coordinates) => {
    if (onRequestSearch) {
      onRequestSearch(coordinates)
    }
  }

  return (
    <div className={classes.root}>
      <Collapse in={loading}>
        <LinearProgress />
      </Collapse>
      <Button
        fullWidth
        variant="contained"
        startIcon={<GpsFixedIcon />}
        onClick={(e) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { coords } = pos
              const { latitude, longitude } = coords
              handleRequestSearch({ lat: latitude, lng: longitude })
            },
            (err) => {
              console.log(err)
              handleRequestSearch({
                lat: 40.44438388588774,
                lng: -79.94336563409755,
              })
            }
          )
        }}
      >
        Find parking
      </Button>
    </div>
  )
}

export default SearchButton
