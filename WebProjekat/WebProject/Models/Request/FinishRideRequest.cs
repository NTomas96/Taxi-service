using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Request
{
    public class FinishRideRequest
    {
        public uint Token { get; set; }
        public long RideId { get; set; }
        public bool Success { get; set; }
        public Comment Comment { get; set; }
        public double Price { get; set; }
        public Location Destination { get; set; }
    }
}