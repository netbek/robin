#!/bin/bash

cyan=`tput setaf 6`
reset=`tput sgr0`

function download () {
  local SRC=$1
  local DEST=$2

  if [ ! -f $DEST ]; then
    wget --header="Accept: text/html" --user-agent="Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:47.0) Gecko/20100101 Firefox/47.0" --output-document="$DEST" "$SRC"
  fi
}

# London Air Quality Network
# API: http://api.erg.kcl.ac.uk/AirQuality/help/operations/GetRawDataSiteCsv
# Terms and conditions: http://api.erg.kcl.ac.uk/AirQuality/Information/Terms/pdf
DIR="laqn"
printf "Starting '${cyan}$DIR${reset}'...\n"
mkdir -p "$DIR"
download "http://api.erg.kcl.ac.uk/AirQuality/Data/Site/Wide/SiteCode=BQ7/StartDate=1-jan-2016/EndDate=31-dec-2016/csv" "$DIR/bq7-20160101-20161231.csv"
download "http://api.erg.kcl.ac.uk/AirQuality/Data/Site/Wide/SiteCode=HK6/StartDate=1-jan-2016/EndDate=31-dec-2016/csv" "$DIR/hk6-20160101-20161231.csv"
download "http://api.erg.kcl.ac.uk/AirQuality/Data/Site/Wide/SiteCode=MY1/StartDate=1-jan-2016/EndDate=31-dec-2016/csv" "$DIR/my1-20160101-20161231.csv"
printf "Finished '${cyan}$DIR${reset}'\n"
