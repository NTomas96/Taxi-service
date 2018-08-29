using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebProject.Database.Mapper;

namespace WebProject.Models
{
    public class Vehicle
    {
        [PrimaryKey]
        public long Id { get; set; }
        public int Year { get; set; }
        public string License { get; set; }
        public string TaxiID { get; set; }
        public VehicleType Type { get; set; }

        public bool Validate()
        {
            return License.Length > 0 && TaxiID.Length > 0;
        }
    }
}