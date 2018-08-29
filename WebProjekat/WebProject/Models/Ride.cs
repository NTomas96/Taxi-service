using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebProject.Database.Mapper;

namespace WebProject.Models
{
    public class Ride
    {
        [PrimaryKey]
        public long Id { get; set; }
        public long Time { get; set; }
        [JsonField]
        public Location Origin { get; set; }
        public VehicleType? VehicleType { get; set; }
        [ForeignField("user", "Id")]
        public User Customer { get; set; }
        [JsonField]
        public Location Destination { get; set; }
        [ForeignField("user", "Id")]
        public Dispatcher Dispatcher { get; set; }
        [ForeignField("user", "Id")]
        public Driver Driver { get; set; }
        public double Price { get; set; }
        public RideStatus Status { get; set; }
        [JsonField]
        public Comment Comment { get; set; }
    }
}