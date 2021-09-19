import {
  Collapse,
  IconButton,
  InputAdornment,
  LinearProgress,
  makeStyles,
  OutlinedInput,
  Paper,
  Tooltip,
} from "@material-ui/core"
import GpsFixedIcon from "@material-ui/icons/GpsFixed"
import SearchIcon from "@material-ui/icons/Search"
import ClearIcon from "@material-ui/icons/Clear"
import React, { useState } from "react"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100%",
  },
}))

const SearchBar = ({
  value,
  loading = false,
  onChange,
  onRequestSearch,
  onCancelSearch,
  placeholder = "Search",
}) => {
  const classes = useStyles()
  const [searchText, setSearchText] = useState(value)

  const handleRequestSearch = (searchText) => {
    if (onRequestSearch) {
      onRequestSearch(searchText)
    }
  }

  const handleCancelSearch = () => {
    if (onCancelSearch) {
      onCancelSearch()
    }
  }

  const endButton = loading ? (
    <Tooltip title="Cancel search" aria-label="cancel search">
      <IconButton
        aria-label="cancel"
        onClick={handleCancelSearch}
        hidden={!loading}
      >
        <ClearIcon />
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="Search location" aria-label="search location">
      <IconButton
        aria-label="search"
        onClick={() => {
          handleRequestSearch(searchText)
        }}
        hidden={loading}
      >
        <SearchIcon />
      </IconButton>
    </Tooltip>
  )

  return (
    <Paper variant="outlined" className={classes.root}>
      <Collapse in={loading}>
        <LinearProgress />
      </Collapse>
      <OutlinedInput
        className={classes.input}
        fullWidth
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleRequestSearch(searchText)
          } else if (e.key === "Escape") {
            handleCancelSearch()
          }
        }}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value)
          if (onChange) {
            onChange(e)
          }
        }}
        placeholder={placeholder}
        startAdornment={
          <InputAdornment position="start">
            <Tooltip
              title="Use current location"
              aria-label="use current location"
            >
              <IconButton
                aria-label="use current location"
                onClick={(e) => {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const { coords } = pos
                    const { latitude, longitude } = coords
                    const coordString = `${latitude},${longitude}`
                    setSearchText(coordString)
                    handleRequestSearch(coordString)
                  })
                }}
              >
                <GpsFixedIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">{endButton}</InputAdornment>
        }
      />
    </Paper>
  )
}

export default SearchBar
