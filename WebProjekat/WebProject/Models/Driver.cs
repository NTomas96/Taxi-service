using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using WebProject.Database.Mapper;

namespace WebProject.Models
{
    public class Driver : User
    {
        public Driver(User user) : base(user)
        {
            Location = base.Location;
            Vehicle = base.Vehicle;
        }

        public Driver()
        {

        }

        public new bool Validate()
        {
            return base.Validate() && Vehicle.Validate();
        }

        [JsonField]
        public new Location Location { get; set; }
        [ForeignField("vehicle", "Id")]
        public new Vehicle Vehicle { get; set; }
    }
}