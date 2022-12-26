# Taxi-service

## Overview

This application simulates a digitalized taxi/dispatcher service system.
User roles and functionalities:
* Admin/Dispatcher:	
  * Creates rides (if request for a ride is from another source e.g. telephone, SMS).
  * Assign rides to drivers (user inicialized rides).
  * Register drivers (create driver users and assign them a car).
  * Block/Unblock(ban) users/drivers.
* Driver:
  * Take rides that are available.
  * Change location on map.
  * Report the ride success/fail, location on map and billing.
* User must register:
  * Orders a ride (setup location, and vehicle type).
  * Can `Edit` or `Cancel` a ride while the ride status is 'Created'.
  * Can `Comment` the ride after it finishes.
  
## Setup

#### Setup SQLite database

* Load admins via `Admins.json` file in repository

#### Setup of WebProject

* Run Visual Studio in `administrator mode` (enables read/write from SQLite database), and open `.sln` file

#### Map update

* In the head tag of `WebProject\Views\Shared\_Layout.cshtml` update the [OpenLayers](https://openlayers.org/download) map

## University project

Don't need any 3rd party contributions, be free to fork and use for yourselves.
