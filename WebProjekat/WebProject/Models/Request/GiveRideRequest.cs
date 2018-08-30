using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Request
{
    public class GiveRideRequest
    {
        public uint Token { get; set; }
        public long RideId { get; set; }
        public long DriverId { get; set; }
    }
}