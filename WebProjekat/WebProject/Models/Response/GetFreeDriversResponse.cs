using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models.Response
{
    public class GetFreeDriversResponse : Response
    {
        public List<Driver> Drivers { get; set; }
    }
}