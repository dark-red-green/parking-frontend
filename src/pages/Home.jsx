import { makeStyles, Typography } from "@material-ui/core"
import React, { useState } from "react"
import SearchBar from "../components/SearchBar"
import axios from "axios"
import { motion } from "framer-motion"
import ResultTable from "../components/ResultTable"

const API_URL = process.env.API_URL || "http://localhost:5000"
const url = API_URL + "/img/2/0840"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    background: "#efcb68",
  },
  dialog: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
    marginTop: "10%",
    padding: "2em",
    "& > *": {
      marginTop: "0.5em",
      marginBottom: "0.5em",
    },
  },
  searchBar: {
    width: "80%",
  },
  park: {
    height: "10em",
    cursor: "pointer",
  },
  tableContainer: {
    width: "60%",
  },
}))

const Home = () => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const [animationState, setAnimationState] = useState(0)
  const [data, setData] = useState(null)

  const animations = {
    dialog: [{ marginTop: "10%" }, { marginTop: "0%" }],
    icon: [{ y: 0 }, { y: "-10%", x: -500, scale: 0.5 }],
    header: [{ opacity: 1 }, { opacity: 0 }],
    searchBar: [{ y: 0 }, { y: "-325%" }],
  }
  const transition = { ease: "easeOut", duration: 1 }

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
            onClick={() => {
              setAnimationState(0)
            }}
          />
        </motion.div>

        <motion.div
          animate={animations.header[animationState]}
          transition={{ ease: "easeOut", duration: 0.25 }}
        >
          <Typography variant="h4">Find available parking spots</Typography>
        </motion.div>

        <motion.div
          className={classes.searchBar}
          animate={animations.searchBar[animationState]}
          transition={transition}
        >
          <SearchBar
            loading={loading}
            onRequestSearch={async (searchText) => {
              setLoading(true)
              setAnimationState(1)
              const { data } = await axios.get(url)
              setData([{ image: data }])
              setLoading(false)
            }}
            onCancelSearch={() => {
              setLoading(false)
            }}
            placeholder="Search parking spot"
          />
        </motion.div>
      </motion.div>
      <div className={classes.tableContainer}>
        <ResultTable data={data} />
      </div>
    </div>
  )
}

export default Home
