import {
  IconButton,
  makeStyles,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core"
import axios from "axios"
import { motion } from "framer-motion"
import React, { useState } from "react"
import ResultTable from "../components/ResultTable"
import GPSButton from "../components/GPSButton"
import { DateTime } from "luxon"
import { TimePicker } from "@material-ui/pickers"
import AccessTimeIcon from "@material-ui/icons/AccessTime"

const API_URL =
  process.env.API_URL || "https://drg-parking-backend.herokuapp.com"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
    [theme.breakpoints.down("md")]: {
      width: "80%",
    },
    marginTop: "10%",
    padding: "2em",
    "& > *": {
      marginTop: "0.5em",
      marginBottom: "0.5em",
    },
  },
  search: {
    width: "40%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  park: {
    height: "10em",
    cursor: "pointer",
  },
  tableContainer: {
    width: "60%",
    [theme.breakpoints.down("md")]: {
      width: "90%",
      marginTop: "-10em",
    },
  },
}))

const Home = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [animationState, setAnimationState] = useState(0)
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState(DateTime.now())
  const md = useMediaQuery((theme) => theme.breakpoints.down("md"))

  const onRequestSearch = async ({ lat, lng }) => {
    setLoading(true)
    setAnimationState(1)
    const timestamp = time.toFormat("HHmm")
    const hours = time.hour
    const minutes = time.minute
    const { data } = await axios.get(
      API_URL + `/get_best_parking/${lat}/${lng}/${hours}/${minutes}`
    )

    const parsed = data.map(
      ({ distance, id, lat, long, name, num_spots_available }) => ({
        distance,
        id,
        lat,
        lng: long,
        name,
        numSpaces: num_spots_available,
      })
    )
    const ids = parsed.map((p) => p.id)

    const images = await Promise.all(
      ids.map(async (id) => {
        const { data: image } = await axios.get(
          API_URL + `/img/${id}/${timestamp}`
        )
        return image
      })
    )
    for (let i = 0; i < parsed.length; i++) {
      parsed[i].image = images[i]
    }

    setData(parsed)
    setLoading(false)
  }

  const animations = {
    dialog: [{ marginTop: "10%" }, { marginTop: "0%" }],
    icon: [
      { y: 0 },
      { y: md ? "-30%" : "-10%", x: md ? 0 : "-200%", scale: 0.5 },
    ],
    header: [{ opacity: 1 }, { opacity: 0 }],
    search: [{ y: 0 }, { y: md ? "-325%" : "-400%" }],
  }
  const transition = { ease: "easeOut", duration: 0.75 }

  return (
    <div className={classes.root}>
      <motion.div
        animate={animations.dialog[animationState]}
        transition={transition}
        className={classes.dialog}
      >
        <motion.div
          animate={animations.icon[animationState]}
          transition={transition}
        >
          <img
            src="/parking-sign.png"
            className={classes.park}
            alt="parking icon"
          />
        </motion.div>

        <motion.div
          animate={animations.header[animationState]}
          transition={{ ease: "easeOut", duration: 0.25 }}
        >
          <Typography variant="h4">Parking Finder</Typography>
        </motion.div>

        <motion.div
          className={classes.search}
          animate={animations.search[animationState]}
          transition={transition}
        >
          <GPSButton loading={loading} onRequestSearch={onRequestSearch} />
          <Tooltip title="Check another time">
            <IconButton onClick={(e) => setOpen(true)}>
              <AccessTimeIcon />
            </IconButton>
          </Tooltip>
        </motion.div>
      </motion.div>
      <div className={classes.tableContainer}>
        <ResultTable data={data} />
      </div>

      <TimePicker
        variant="dialog"
        label="Time"
        value={time}
        onChange={setTime}
        open={open}
        onClose={() => setOpen(false)}
        TextFieldComponent={(props) => null}
      />
    </div>
  )
}

export default Home
