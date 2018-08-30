using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Response
{
    public class RideListResponse : Response
    {
        public List<Ride> Rides { get; set; }
        public List<Ride> Extra { get; set; }
    }
}