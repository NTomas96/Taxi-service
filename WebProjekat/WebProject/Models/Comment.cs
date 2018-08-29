using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebProject.Models
{
    public class Comment
    {
        public string Description { get; set; }
        public long Time { get; set; }
        public long UserId { get; set; }
        public string Username { get; set; }
        public long RideId { get; set; }
        public int Review { get; set; }
    }
}