#!/bin/bash

# London Air Quality Network
# http://api.erg.kcl.ac.uk/AirQuality/help/operations/GetRawDataSiteCsv
mkdir -p laqn
cd laqn
wget -O bq7-20160101-20161231.csv http://api.erg.kcl.ac.uk/AirQuality/Data/Site/Wide/SiteCode=BQ7/StartDate=1-jan-2016/EndDate=31-dec-2016/csv
wget -O hk6-20160101-20161231.csv http://api.erg.kcl.ac.uk/AirQuality/Data/Site/Wide/SiteCode=HK6/StartDate=1-jan-2016/EndDate=31-dec-2016/csv
wget -O my1-20160101-20161231.csv http://api.erg.kcl.ac.uk/AirQuality/Data/Site/Wide/SiteCode=MY1/StartDate=1-jan-2016/EndDate=31-dec-2016/csv
