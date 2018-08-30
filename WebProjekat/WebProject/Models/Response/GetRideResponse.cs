using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Response
{
    public class GetRideResponse : Response
    {
        public Ride Ride { get; set; }
    }
}