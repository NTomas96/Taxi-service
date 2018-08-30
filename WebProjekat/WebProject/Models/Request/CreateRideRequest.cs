using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Request
{
    public class CreateRideRequest
    {
        public uint Token { get; set; }
        public Location Location { get; set; }
        public int VehicleType { get; set; }
        public long DriverId { get; set; }
    }
}