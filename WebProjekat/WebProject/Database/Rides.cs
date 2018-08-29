using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebProject.Models;

namespace WebProject.Database
{
    public class Rides
    {
        private Database database;

        public Rides(Database database)
        {
            this.database = database;
        }

        public bool AddRide(Ride ride)
        {
            try
            {
                return database.Insert<Ride>("ride", ride) > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool UpdateRide(Ride ride)
        {
            try
            {
                return database.Update<Ride>("ride", ride) > 0;
            }
            catch
            {
                return false;
            }
        }

        public List<Ride> GetRidesByCustomerId(long Id)
        {
            return database.Select<Ride>("SELECT * FROM ride WHERE Customer = @id", new Dictionary<string, object>() { { "@id", Id } });

        }

        public Ride GetRideById(long Id)
        {
            return database.SelectOne<Ride>("SELECT * FROM ride WHERE Id = @id", new Dictionary<string, object>() { { "@id", Id } });

        }

        public List<Driver> GetFreeDrivers()
        {
            List<Driver> allDrivers = database.Select<Driver>("SELECT * FROM user WHERE Role = @role", new Dictionary<string, object>() { { "@role", Role.Driver } });
            List<Driver> result = new List<Driver>();

            List<Ride> ridesInProgress = database.Select<Ride>("SELECT * FROM ride WHERE Status = @status1 OR Status = @status2 OR Status = @status3", new Dictionary<string, object>() { { "@status1", RideStatus.Accepted }, { "@status2", RideStatus.Processed }, { "@status3", RideStatus.Formed } });

            foreach(Driver driver in allDrivers)
            {
                bool found = false;

                foreach(Ride ride in ridesInProgress)
                {
                    if(ride.Driver != null && ride.Driver.Id == driver.Id)
                    {
                        found = true;
                        break;
                    }
                }

                if(!found)
                {
                    result.Add(driver);
                }
            }

            return result;
        }

        public List<Ride> GetAllRides()
        {
            return database.Select<Ride>("SELECT * FROM ride", new Dictionary<string, object>() {});
        }

        public List<Ride> GetFreeRides()
        {
            return database.Select<Ride>("SELECT * FROM ride WHERE Status = @status1", new Dictionary<string, object>() { { "@status1", RideStatus.Created }});
        }

        public List<Ride> GetRidesByDriverId(long Id)
        {
            return database.Select<Ride>("SELECT * FROM ride WHERE Driver = @id", new Dictionary<string, object>() { { "@id", Id } });
        }

        public List<Ride> GetRidesByDispatcherId(long Id)
        {
            return database.Select<Ride>("SELECT * FROM ride WHERE Dispatcher = @id", new Dictionary<string, object>() { { "@id", Id } });
        }
    }
}