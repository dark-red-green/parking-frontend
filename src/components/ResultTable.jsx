import React, { useState } from "react"
import {
  TableContainer,
  Paper,
  TableBody,
  Table,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Typography,
  makeStyles,
  TableHead,
} from "@material-ui/core"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"
import { green, red } from "@material-ui/core/colors"

const useStyles = makeStyles((theme) => ({
  resultImage: {
    height: "20em",
    width: "auto",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
  },
  spaceGood: {
    color: green[500],
  },
  spaceBad: {
    color: red[500],
  },
  space: {
    fontWeight: "bold",
    fontSize: "1.5em"
  },
}))

const Row = ({
  name = "Parking Lot 1",
  lat = 40.444,
  lng = -79.946,
  image,
  numSpaces = 0,
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const spaceColor = numSpaces > 0 ? classes.spaceGood : classes.spaceBad

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {name}
        </TableCell>
        <TableCell align="center">{`Lat: ${lat}, Lon: ${lng}`}</TableCell>
        <TableCell align="center" className={`${classes.space} ${spaceColor}`}>
          {numSpaces}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.imageContainer}>
              {image ? (
                <img
                  className={classes.resultImage}
                  src={`data:image/png;base64,${image}`}
                  alt={name}
                />
              ) : null}
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const ResultTable = ({ data }) => {
  if (data == null) {
    return null
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell align="center">Location</TableCell>
            <TableCell align="center">Available Spaces</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((entry, idx) => (
            <Row key={idx} {...entry} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ResultTable
